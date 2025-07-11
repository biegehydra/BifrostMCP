import * as vscode from 'vscode';
import { createVscodePosition, getPreview, convertSymbol, asyncMap, convertSemanticTokens, getSymbolKindString } from './helpers';
import { ReferencesAndPreview, RenameEdit } from './rosyln';
import { mcpTools } from './tools';

const toolNames = mcpTools.map((tool) => tool.name);

export const runTool = async (name: string, args: any) => {
    let result: any;
    if (!toolNames.includes(name)) {
        throw new Error(`Unknown tool: ${name}`);
    }
    // Verify file exists before proceeding
    const uri = vscode.Uri.parse(args?.textDocument?.uri ?? '');
    try {
        await vscode.workspace.fs.stat(uri);
    } catch (error) {
        return {
            content: [{ 
                type: "text", 
                text: `Error: File not found - ${uri.fsPath}` 
            }],
            isError: true
        };
    }

    const position = args?.position ? createVscodePosition(
        args.position.line,
        args.position.character
    ) : undefined;

    let command: string;
    let commandResult: any;
    
    switch (name) {
        case "find_usages":
            command = 'vscode.executeReferenceProvider';
            const locations = await vscode.commands.executeCommand<vscode.Location[]>(
                command,
                uri,
                position
            );

            if (!locations) {
                result = [];
                break;
            }

            // Convert VSCode locations to our response format with previews
            const references: ReferencesAndPreview[] = [];
            
            for (const location of locations) {
                try {
                    const document = await vscode.workspace.openTextDocument(location.uri);
                    const preview = document.lineAt(location.range.start.line).text.trim();
                    
                    references.push({
                        uri: location.uri.toString(),
                        range: {
                            start: {
                                line: location.range.start.line,
                                character: location.range.start.character
                            },
                            end: {
                                line: location.range.end.line,
                                character: location.range.end.character
                            }
                        },
                        preview
                    });
                } catch (error) {
                    console.warn(`Failed to get preview for reference: ${error}`);
                    // Continue with other references even if one preview fails
                }
            }
            result = references;
            break;

        case "go_to_definition":
            command = 'vscode.executeDefinitionProvider';
            commandResult = await vscode.commands.executeCommand(command, uri, position);
            result = await asyncMap(commandResult, async (def: vscode.Location) => ({
                uri: def.uri.toString(),
                range: {
                    start: {
                        line: def.range.start.line,
                        character: def.range.start.character
                    },
                    end: {
                        line: def.range.end.line,
                        character: def.range.end.character
                    }
                },
                preview: await getPreview(def.uri, def.range?.start.line)
            }));
            break;

        case "find_implementations":
            command = 'vscode.executeImplementationProvider';
            commandResult = await vscode.commands.executeCommand(command, uri, position);
            result = await asyncMap(commandResult, async (impl: vscode.Location) => ({
                uri: impl.uri.toString(),   
                range: {
                    start: {
                        line: impl.range.start.line,
                        character: impl.range.start.character
                    },
                    end: {
                        line: impl.range.end.line,
                        character: impl.range.end.character
                    }
                },
                preview: await getPreview(uri, impl.range?.start.line)
            }));    
            break;

        case "get_hover_info":
            command = 'vscode.executeHoverProvider';
            commandResult = await vscode.commands.executeCommand(command, uri, position);
            result = await asyncMap(commandResult, async (hover: vscode.Hover) => ({
                contents: hover.contents.map(content => 
                    typeof content === 'string' ? content : content.value
                ),
                range: hover.range ? {
                    start: {
                        line: hover.range.start.line,
                        character: hover.range.start.character
                    },
                    end: {
                        line: hover.range.end.line,
                        character: hover.range.end.character
                    }
                } : undefined,
                preview: await getPreview(uri, hover.range?.start.line)
            }));
            break;

        case "get_document_symbols":
            command = 'vscode.executeDocumentSymbolProvider';
            commandResult = await vscode.commands.executeCommand(command, uri);
            result = commandResult?.map(convertSymbol);
            break;

        case "get_completions":
            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                uri,
                position,
                args?.triggerCharacter
            );
            result = completions?.items.map(item => ({
                label: item.label,
                kind: item.kind,
                detail: item.detail,
                documentation: item.documentation,
                sortText: item.sortText,
                filterText: item.filterText,
                insertText: item.insertText,
                range: item.range && ('start' in item.range) ? {
                    start: {
                        line: item.range.start.line,
                        character: item.range.start.character
                    },
                    end: {
                        line: item.range.end.line,
                        character: item.range.end.character
                    }
                } : undefined
            }));
            break;

        case "get_signature_help":
            const signatureHelp = await vscode.commands.executeCommand<vscode.SignatureHelp>(
                'vscode.executeSignatureHelpProvider',
                uri,
                position
            );
            result = signatureHelp?.signatures.map(sig => ({
                label: sig.label,
                documentation: sig.documentation,
                parameters: sig.parameters?.map(param => ({
                    label: param.label,
                    documentation: param.documentation
                })),
                activeParameter: signatureHelp.activeParameter,
                activeSignature: signatureHelp.activeSignature
            }));
            break;

        case "get_rename_locations": {
            const newName = args?.newName || "newName";
            const renameEdits = await vscode.commands.executeCommand<vscode.WorkspaceEdit>(
                'vscode.executeDocumentRenameProvider',
                uri,
                position,
                newName
            );
            if (renameEdits) {
                const entries: RenameEdit[] = [];
                for (const [editUri, edits] of renameEdits.entries()) {
                    entries.push({
                        uri: editUri.toString(),
                        edits: edits.map(edit => ({
                            range: {
                                start: {
                                    line: edit.range.start.line,
                                    character: edit.range.start.character
                                },
                                end: {
                                    line: edit.range.end.line,
                                    character: edit.range.end.character
                                }
                            },
                            newText: edit.newText
                        }))
                    });
                }
                result = entries;
            } else {
                result = [];
            }
            break;
        }
       
        case "rename": {
            const newName = args?.newName || "newName";
            const renameEdits = await vscode.commands.executeCommand<vscode.WorkspaceEdit>(
                'vscode.executeDocumentRenameProvider',
                uri,
                position,
                newName
            );
            if (renameEdits) {
                const success = await vscode.workspace.applyEdit(renameEdits);
                return {
                    content: [{
                        type: "text",
                        text: success ? "Symbol renamed successfully" : "Symbol renaming failed"
                    }],
                    isError: false
                };
            } else {
                return {
                    content: [{
                        type: "text",
                        text: "Symbol to rename not found"
                    }],
                    isError: false
                };
            }
            break;
        }

        case "get_code_actions":
            const codeActions = await vscode.commands.executeCommand<vscode.CodeAction[]>(
                'vscode.executeCodeActionProvider',
                uri,
                position ? new vscode.Range(position, position) : undefined
            );
            result = codeActions?.map(action => ({
                title: action.title,
                kind: action.kind?.value,
                isPreferred: action.isPreferred,
                diagnostics: action.diagnostics?.map(diag => ({
                    message: diag.message,
                    severity: diag.severity,
                    range: {
                        start: {
                            line: diag.range.start.line,
                            character: diag.range.start.character
                        },
                        end: {
                            line: diag.range.end.line,
                            character: diag.range.end.character
                        }
                    }
                }))
            }));
            break;

        case "get_code_lens":
            const codeLensUri = vscode.Uri.parse((args as any).textDocument?.uri);
            try {
                const codeLensResult = await vscode.commands.executeCommand<vscode.CodeLens[]>(
                    'vscode.executeCodeLensProvider',
                    codeLensUri
                );

                if (!codeLensResult || codeLensResult.length === 0) {
                    return {
                        content: [{ 
                            type: "text", 
                            text: "No CodeLens items found in document" 
                        }],
                        isError: false
                    };
                }

                result = codeLensResult.map(lens => ({
                    range: {
                        start: {
                            line: lens.range.start.line,
                            character: lens.range.start.character
                        },
                        end: {
                            line: lens.range.end.line,
                            character: lens.range.end.character
                        }
                    },
                    command: lens.command ? {
                        title: lens.command.title,
                        command: lens.command.command,
                        arguments: lens.command.arguments
                    } : undefined
                }));
            } catch (error) {
                return {
                    content: [{ 
                        type: "text", 
                        text: `Error executing CodeLens provider: ${error}` 
                    }],
                    isError: true
                };
            }
            break;
    
        case "get_selection_range":
            const selectionRanges = await vscode.commands.executeCommand<vscode.SelectionRange[]>(
                'vscode.executeSelectionRangeProvider',
                uri,
                [position]
            );
            result = selectionRanges?.map(range => ({
                range: {
                    start: {
                        line: range.range.start.line,
                        character: range.range.start.character
                    },
                    end: {
                        line: range.range.end.line,
                        character: range.range.end.character
                    }
                },
                parent: range.parent ? {
                    range: {
                        start: {
                            line: range.parent.range.start.line,
                            character: range.parent.range.start.character
                        },
                        end: {
                            line: range.parent.range.end.line,
                            character: range.parent.range.end.character
                        }
                    }
                } : undefined
            }));
            break;

        case "get_type_definition":
            const typeDefinitions = await vscode.commands.executeCommand<vscode.Location[] | vscode.LocationLink[]>(
                'vscode.executeTypeDefinitionProvider',
                uri,
                position
            );
            result = typeDefinitions?.map(loc => {
                if ('targetUri' in loc) {
                    return {
                        targetUri: loc.targetUri.toString(),
                        targetRange: {
                            start: {
                                line: loc.targetRange.start.line,
                                character: loc.targetRange.start.character
                            },
                            end: {
                                line: loc.targetRange.end.line,
                                character: loc.targetRange.end.character
                            }
                        },
                        originSelectionRange: loc.originSelectionRange ? {
                            start: {
                                line: loc.originSelectionRange.start.line,
                                character: loc.originSelectionRange.start.character
                            },
                            end: {
                                line: loc.originSelectionRange.end.line,
                                character: loc.originSelectionRange.end.character
                            }
                        } : undefined
                    };
                } else {
                    return {
                        uri: loc.uri.toString(),
                        range: {
                            start: {
                                line: loc.range.start.line,
                                character: loc.range.start.character
                            },
                            end: {
                                line: loc.range.end.line,
                                character: loc.range.end.character
                            }
                        }
                    };
                }
            });
            break;

        case "get_declaration":
            const declarations = await vscode.commands.executeCommand<vscode.Location[] | vscode.LocationLink[]>(
                'vscode.executeDeclarationProvider',
                uri,
                position
            );
            result = declarations?.map(loc => {
                if ('targetUri' in loc) {
                    return {
                        targetUri: loc.targetUri.toString(),
                        targetRange: {
                            start: {
                                line: loc.targetRange.start.line,
                                character: loc.targetRange.start.character
                            },
                            end: {
                                line: loc.targetRange.end.line,
                                character: loc.targetRange.end.character
                            }
                        },
                        originSelectionRange: loc.originSelectionRange ? {
                            start: {
                                line: loc.originSelectionRange.start.line,
                                character: loc.originSelectionRange.start.character
                            },
                            end: {
                                line: loc.originSelectionRange.end.line,
                                character: loc.originSelectionRange.end.character
                            }
                        } : undefined
                    };
                } else {
                    return {
                        uri: loc.uri.toString(),
                        range: {
                            start: {
                                line: loc.range.start.line,
                                character: loc.range.start.character
                            },
                            end: {
                                line: loc.range.end.line,
                                character: loc.range.end.character
                            }
                        }
                    };
                }
            });
            break;

        case "get_document_highlights":
            const highlights = await vscode.commands.executeCommand<vscode.DocumentHighlight[]>(
                'vscode.executeDocumentHighlights',
                uri,
                position
            );
            result = highlights?.map(highlight => ({
                range: {
                    start: {
                        line: highlight.range.start.line,
                        character: highlight.range.start.character
                    },
                    end: {
                        line: highlight.range.end.line,
                        character: highlight.range.end.character
                    }
                },
                kind: highlight.kind
            }));
            break;

        case "get_workspace_symbols":
            const query = args.query || '';
            const symbols = await vscode.commands.executeCommand<vscode.SymbolInformation[]>(
                'vscode.executeWorkspaceSymbolProvider',
                query
            );
            result = symbols?.map(symbol => ({
                name: symbol.name,
                kind: symbol.kind,
                location: {
                    uri: symbol.location.uri.toString(),
                    range: {
                        start: {
                            line: symbol.location.range.start.line,
                            character: symbol.location.range.start.character
                        },
                        end: {
                            line: symbol.location.range.end.line,
                            character: symbol.location.range.end.character
                        }
                    }
                },
                containerName: symbol.containerName
            }));
            break;

        case "get_semantic_tokens":
            const semanticTokensUri = vscode.Uri.parse((args as any).textDocument?.uri);
            
            // Check if semantic tokens provider is available
            const providers = await vscode.languages.getLanguages();
            const document = await vscode.workspace.openTextDocument(semanticTokensUri);
            const hasSemanticTokens = providers.includes(document.languageId);
            
            if (!hasSemanticTokens) {
                return {
                    content: [{ 
                        type: "text", 
                        text: `Semantic tokens not supported for language: ${document.languageId}` 
                    }],
                    isError: true
                };
            }

            try {
                const semanticTokens = await vscode.commands.executeCommand<vscode.SemanticTokens>(
                    'vscode.provideDocumentSemanticTokens',
                    semanticTokensUri
                );

                if (!semanticTokens) {
                    return {
                        content: [{ 
                            type: "text", 
                            text: "No semantic tokens found in document" 
                        }],
                        isError: false
                    };
                }

                // Convert to human-readable format
                const readableTokens = convertSemanticTokens(semanticTokens, document);
                
                result = {
                    resultId: semanticTokens.resultId,
                    tokens: readableTokens
                };
            } catch (error) {
                // If the command is not found, try alternative approach
                const tokenTypes = [
                    'namespace', 'class', 'enum', 'interface',
                    'struct', 'typeParameter', 'type', 'parameter',
                    'variable', 'property', 'enumMember', 'decorator',
                    'event', 'function', 'method', 'macro', 'keyword',
                    'modifier', 'comment', 'string', 'number', 'regexp',
                    'operator'
                ];
                
                // Use document symbols as fallback
                const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
                    'vscode.executeDocumentSymbolProvider',
                    semanticTokensUri
                );

                if (symbols) {
                    result = {
                        fallback: "Using document symbols as fallback",
                        symbols: symbols.map(symbol => ({
                            name: symbol.name,
                            kind: symbol.kind,
                            range: {
                                start: {
                                    line: symbol.range.start.line,
                                    character: symbol.range.start.character
                                },
                                end: {
                                    line: symbol.range.end.line,
                                    character: symbol.range.end.character
                                }
                            },
                            tokenType: tokenTypes[symbol.kind] || 'unknown'
                        }))
                    };
                } else {
                    return {
                        content: [{ 
                            type: "text", 
                            text: "Semantic tokens provider not available and fallback failed" 
                        }],
                        isError: true
                    };
                }
            }
            break;

        case "get_call_hierarchy":
            const callHierarchyItems = await vscode.commands.executeCommand<vscode.CallHierarchyItem[]>(
                'vscode.prepareCallHierarchy',
                uri,
                position
            );
            
            if (callHierarchyItems?.[0]) {
                const [incomingCalls, outgoingCalls] = await Promise.all([
                    vscode.commands.executeCommand<vscode.CallHierarchyIncomingCall[]>(
                        'vscode.executeCallHierarchyIncomingCalls',
                        callHierarchyItems[0]
                    ),
                    vscode.commands.executeCommand<vscode.CallHierarchyOutgoingCall[]>(
                        'vscode.executeCallHierarchyOutgoingCalls',
                        callHierarchyItems[0]
                    )
                ]);

                result = {
                    item: {
                        name: callHierarchyItems[0].name,
                        kind: getSymbolKindString(callHierarchyItems[0].kind),
                        detail: callHierarchyItems[0].detail,
                        uri: callHierarchyItems[0].uri.toString(),
                        range: {
                            start: {
                                line: callHierarchyItems[0].range.start.line,
                                character: callHierarchyItems[0].range.start.character
                            },
                            end: {
                                line: callHierarchyItems[0].range.end.line,
                                character: callHierarchyItems[0].range.end.character
                            }
                        }
                    },
                    incomingCalls: incomingCalls?.map(call => ({
                        from: {
                            name: call.from.name,
                            kind: getSymbolKindString(call.from.kind),
                            uri: call.from.uri.toString(),
                            range: {
                                start: {
                                    line: call.from.range.start.line,
                                    character: call.from.range.start.character
                                },
                                end: {
                                    line: call.from.range.end.line,
                                    character: call.from.range.end.character
                                }
                            }
                        },
                        fromRanges: call.fromRanges.map(range => ({
                            start: {
                                line: range.start.line,
                                character: range.start.character
                            },
                            end: {
                                line: range.end.line,
                                character: range.end.character
                            }
                        }))
                    })),
                    outgoingCalls: outgoingCalls?.map(call => ({
                        to: {
                            name: call.to.name,
                            kind: getSymbolKindString(call.to.kind),
                            uri: call.to.uri.toString(),
                            range: {
                                start: {
                                    line: call.to.range.start.line,
                                    character: call.to.range.start.character
                                },
                                end: {
                                    line: call.to.range.end.line,
                                    character: call.to.range.end.character
                                }
                            }
                        },
                        fromRanges: call.fromRanges.map(range => ({
                            start: {
                                line: range.start.line,
                                character: range.start.character
                            },
                            end: {
                                line: range.end.line,
                                character: range.end.character
                            }
                        }))
                    }))
                };
            }
            break;

        case "get_type_hierarchy":
            const typeHierarchyItems = await vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>(
                'vscode.prepareTypeHierarchy',
                uri,
                position
            );
            
            if (typeHierarchyItems?.[0]) {
                const [supertypes, subtypes] = await Promise.all([
                    vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>(
                        'vscode.executeTypeHierarchySupertypeCommand',
                        typeHierarchyItems[0]
                    ),
                    vscode.commands.executeCommand<vscode.TypeHierarchyItem[]>(
                        'vscode.executeTypeHierarchySubtypeCommand',
                        typeHierarchyItems[0]
                    )
                ]);

                result = {
                    item: {
                        name: typeHierarchyItems[0].name,
                        kind: getSymbolKindString(typeHierarchyItems[0].kind),
                        detail: typeHierarchyItems[0].detail,
                        uri: typeHierarchyItems[0].uri.toString(),
                        range: {
                            start: {
                                line: typeHierarchyItems[0].range.start.line,
                                character: typeHierarchyItems[0].range.start.character
                            },
                            end: {
                                line: typeHierarchyItems[0].range.end.line,
                                character: typeHierarchyItems[0].range.end.character
                            }
                        }
                    },
                    supertypes: supertypes?.map(type => ({
                        name: type.name,
                        kind: getSymbolKindString(type.kind),
                        detail: type.detail,
                        uri: type.uri.toString(),
                        range: {
                            start: {
                                line: type.range.start.line,
                                character: type.range.start.character
                            },
                            end: {
                                line: type.range.end.line,
                                character: type.range.end.character
                            }
                        }
                    })),
                    subtypes: subtypes?.map(type => ({
                        name: type.name,
                        kind: getSymbolKindString(type.kind),
                        detail: type.detail,
                        uri: type.uri.toString(),
                        range: {
                            start: {
                                line: type.range.start.line,
                                character: type.range.start.character
                            },
                            end: {
                                line: type.range.end.line,
                                character: type.range.end.character
                            }
                        }
                    }))
                };
            }
            break;
    
        default:
            throw new Error(`Unknown tool: ${name}`);
    }
    return result;
}
