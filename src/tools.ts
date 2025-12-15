export const mcpTools = [
    {
        name: "find_usages",
        description: 
            "Finds all references to a symbol at a specified location in code. This tool helps you identify where functions, variables, types, or other symbols are used throughout the codebase. " +
            "It performs a deep semantic analysis to find true references, not just text matches. " +
            "The results include:\n" +
            "- Complete file path for each reference\n" +
            "- Precise location (line and character position)\n" +
            "- Context preview showing how the symbol is used\n" +
            "- Optional inclusion of the symbol's declaration\n\n" +
            "This is particularly useful for:\n" +
            "- Understanding dependencies between different parts of the code\n" +
            "- Safely planning refactoring operations\n" +
            "- Analyzing the impact of potential changes\n" +
            "- Tracing data flow through the application\n\n" +
            "Note: Line numbers are 0-based (first line is 0), while character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document (file:///path/to/file format)"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                },
                context: {
                    type: "object",
                    description: "Additional context for the request",
                    properties: {
                        includeDeclaration: {
                            type: "boolean",
                            description: "Whether to include the declaration of the symbol in the results",
                            default: true
                        }
                    }
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "go_to_definition",
        description: "Navigates to the original definition of a symbol at a specified location in code. " +
            "This tool performs semantic analysis to find the true source definition, not just matching text. It can locate:\n" +
            "- Function/method declarations\n" +
            "- Class/interface definitions\n" +
            "- Variable declarations\n" +
            "- Type definitions\n" +
            "- Import/module declarations\n\n" +
            "The tool is essential for:\n" +
            "- Understanding where code elements are defined\n" +
            "- Navigating complex codebases\n" +
            "- Verifying the actual implementation of interfaces/abstractions\n\n" +
            "Note: Line numbers are 0-based (first line is 0), while character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: " line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "find_implementations",
        description: "Discovers all concrete implementations of an interface, abstract class, or abstract method in the codebase. " +
            "This tool performs deep semantic analysis to find all places where:\n" +
            "- Interfaces are implemented by classes\n" +
            "- Abstract classes are extended\n" +
            "- Abstract methods are overridden\n" +
            "- Virtual methods are overridden\n\n" +
            "This is particularly valuable for:\n" +
            "- Understanding polymorphic behavior in the codebase\n" +
            "- Finding all concrete implementations of an interface\n" +
            "- Analyzing inheritance hierarchies\n" +
            "- Verifying contract implementations\n\n" +
            "Note: Line numbers are 0-based (first line is 0), while character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_hover_info",
        description: "Retrieves comprehensive information about a symbol when hovering over it in code. " +
            "This tool provides rich contextual details including:\n" +
            "- Full type information and signatures\n" +
            "- Documentation comments and summaries\n" +
            "- Return types and parameter descriptions\n" +
            "- Type constraints and generic parameters\n" +
            "- Deprecation notices and version information\n\n" +
            "This is especially useful for:\n" +
            "- Understanding API usage and requirements\n" +
            "- Viewing documentation without leaving the context\n" +
            "- Verifying type information during development\n" +
            "- Quick access to symbol metadata\n\n" +
            "Note: Line numbers are 0-based (first line is 0), while character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_document_symbols",
        description: "Analyzes and returns a hierarchical list of all symbols defined within a document. " +
            "This tool provides a comprehensive overview of the code structure by identifying:\n" +
            "- Classes and interfaces\n" +
            "- Methods and functions\n" +
            "- Properties and fields\n" +
            "- Namespaces and modules\n" +
            "- Constants and enumerations\n\n" +
            "The symbols are returned in a structured format that preserves their relationships and scope. " +
            "This is particularly useful for:\n" +
            "- Understanding the overall structure of a file\n" +
            "- Creating code outlines and documentation\n" +
            "- Navigating large files efficiently\n" +
            "- Analyzing code organization and architecture",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to analyze",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                }
            },
            required: ["textDocument"]
        }
    },
    {
        name: "get_completions",
        description: "Provides intelligent code completion suggestions based on the current context and cursor position. " +
            "This tool analyzes the code to offer relevant suggestions including:\n" +
            "- Variable and function names\n" +
            "- Class and type names\n" +
            "- Property and method completions\n" +
            "- Import statements\n" +
            "- Snippets and common patterns\n\n" +
            "The suggestions are context-aware and can be triggered by:\n" +
            "- Typing part of a symbol name\n" +
            "- Accessing object properties (.)\n" +
            "- Opening brackets or parentheses\n" +
            "- Language-specific triggers\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to get completions for",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position to get completions at",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                },
                triggerCharacter: {
                    type: "string",
                    description: "Optional trigger character that caused completion"
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_signature_help",
        description: "Provides detailed information about function signatures as you type function calls. " +
            "This tool offers real-time assistance with:\n" +
            "- Parameter names and types\n" +
            "- Parameter documentation\n" +
            "- Overload information\n" +
            "- Return type details\n" +
            "- Generic type constraints\n\n" +
            "The signature help is context-sensitive and updates as you type, showing:\n" +
            "- Currently active parameter\n" +
            "- Available overloads\n" +
            "- Type compatibility information\n" +
            "- Optional and default values\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to get signature help for",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position to get signature help at",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_rename_locations",
        description: "Identifies all locations that need to be updated when renaming a symbol. " +
            "This tool performs a comprehensive analysis to ensure safe and accurate renaming by:\n" +
            "- Finding all references to the symbol\n" +
            "- Checking for naming conflicts\n" +
            "- Analyzing scope boundaries\n" +
            "- Identifying related declarations\n\n" +
            "The tool is particularly valuable for:\n" +
            "- Safe refactoring operations\n" +
            "- Cross-file symbol renaming\n" +
            "- Impact analysis before renaming\n" +
            "- Maintaining code consistency\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol to rename",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol to rename",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                },
                newName: {
                    type: "string",
                    description: "The new name for the symbol"
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "rename",
        description: "Identifies all locations that need to be updated when renaming a symbol, and performs the renaming. " +
            "This tool performs a comprehensive analysis to ensure safe and accurate renaming by:\n" +
            "- Finding all references to the symbol\n" +
            "- Checking for naming conflicts\n" +
            "- Analyzing scope boundaries\n" +
            "- Identifying related declarations\n\n" +
            "The tool is particularly valuable for:\n" +
            "- Safe refactoring operations\n" +
            "- Cross-file symbol renaming\n" +
            "- Maintaining code consistency\n\n" +
            "- Renaming without the need to generate code\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol to rename",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol to rename",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                },
                newName: {
                    type: "string",
                    description: "The new name for the symbol"
                }
            },
            required: ["textDocument", "position", "newName"]
        }
    },
    {
        name: "get_code_actions",
        description: "Provides context-aware code actions and refactoring suggestions at a specified location. " +
            "This tool analyzes the code to offer intelligent improvements such as:\n" +
            "- Quick fixes for errors and warnings\n" +
            "- Code refactoring options\n" +
            "- Import management suggestions\n" +
            "- Code style improvements\n" +
            "- Performance optimizations\n\n" +
            "Available actions may include:\n" +
            "- Extract method/variable/constant\n" +
            "- Implement interface members\n" +
            "- Add missing imports\n" +
            "- Convert code constructs\n" +
            "- Fix code style issues\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to get code actions for",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position to get code actions at",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument"]
        }
    },
    {
        name: "get_semantic_tokens",
        description: "Provides detailed semantic token information for enhanced code understanding and highlighting. " +
            "This tool performs deep analysis to identify and classify code elements:\n" +
            "- Variables and their scopes\n" +
            "- Function and method names\n" +
            "- Type names and annotations\n" +
            "- Keywords and operators\n" +
            "- Comments and documentation\n\n" +
            "The semantic information enables:\n" +
            "- Precise syntax highlighting\n" +
            "- Code navigation improvements\n" +
            "- Better code understanding\n" +
            "- Accurate symbol classification\n" +
            "- Enhanced code analysis",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to get semantic tokens for",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                }
            },
            required: ["textDocument"]
        }
    },
    {
        name: "get_call_hierarchy",
        description: "Analyzes and visualizes the call relationships between functions and methods in the codebase. " +
            "This tool builds a comprehensive call graph showing:\n" +
            "- Incoming calls (who calls this function)\n" +
            "- Outgoing calls (what this function calls)\n" +
            "- Call chains and dependencies\n" +
            "- Recursive call patterns\n\n" +
            "This information is invaluable for:\n" +
            "- Understanding code flow and dependencies\n" +
            "- Analyzing impact of changes\n" +
            "- Debugging complex call chains\n" +
            "- Optimizing function relationships\n" +
            "- Identifying potential refactoring targets\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the function",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the function",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_type_hierarchy",
        description: "Analyzes and visualizes the inheritance and implementation relationships between types. " +
            "This tool creates a comprehensive type hierarchy showing:\n" +
            "- Parent classes and interfaces\n" +
            "- Child classes and implementations\n" +
            "- Interface inheritance chains\n" +
            "- Mixin and trait relationships\n\n" +
            "The hierarchy information is crucial for:\n" +
            "- Understanding class relationships\n" +
            "- Analyzing inheritance patterns\n" +
            "- Planning class structure changes\n" +
            "- Identifying potential abstraction opportunities\n" +
            "- Verifying type system design\n\n" +
            "Note: Line numbers are 0-based (first line is 0), and character positions are 0-based (first character is 0).",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the type",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the type",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_code_lens",
        description: "Gets CodeLens information for a document, showing actionable contextual information inline with code",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to get CodeLens for",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                }
            },
            required: ["textDocument"]
        }
    },
    {
        name: "get_selection_range",
        description: "Gets selection ranges for a position in a document. This helps in smart selection expansion based on semantic document structure.",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to analyze",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position to get selection ranges for",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_type_definition",
        description: "Finds type definitions of a symbol at a specified location. This is particularly useful for finding the underlying type definitions of variables, interfaces, and classes.",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_declaration",
        description: "Finds declarations of a symbol at a specified location. This helps in navigating to where symbols are declared, particularly useful for imported symbols.",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document containing the symbol",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_document_highlights",
        description: "Finds all highlights of a symbol in a document. This is useful for highlighting all occurrences of a symbol within the current document.",
        inputSchema: {
            type: "object",
            properties: {
                textDocument: {
                    type: "object",
                    description: "The document to analyze",
                    properties: {
                        uri: {
                            type: "string",
                            description: "URI of the document"
                        }
                    },
                    required: ["uri"]
                },
                position: {
                    type: "object",
                    description: "The position of the symbol",
                    properties: {
                        line: {
                            type: "number",
                            description: "Zero-based line number"
                        },
                        character: {
                            type: "number",
                            description: "Zero-based character position"
                        }
                    },
                    required: ["line", "character"]
                }
            },
            required: ["textDocument", "position"]
        }
    },
    {
        name: "get_workspace_symbols",
        description: "Searches for symbols across the entire workspace. This is useful for finding symbols by name across all files. Especially useful for finding the file and positions of a symbol to use in other tools.",
        inputSchema: {
            type: "object",
            properties: {
                query: {
                    type: "string",
                    description: "The search query for finding symbols"
                }
            },
            required: ["query"]
        }
    }
];

export const toolsDescriptions = [
    {
        name: "find_usages",
        description: "Find all references to a symbol"
    },
    {
        name: "go_to_definition",
        description: "Find definition of a symbol"
    },
    {
        name: "find_implementations",
        description: "Find implementations of interface/abstract method"
    },
    {
        name: "get_hover_info",
        description: "Get hover information for a symbol"
    },
    {
        name: "get_document_symbols",
        description: "Get all symbols in document"
    },
    {
        name: "get_completions",
        description: "Get code completion suggestions at a position"
    },
    {
        name: "get_signature_help",
        description: "Get function signature information"
    },
    {
        name: "get_rename_locations",
        description: "Get all locations that would be affected by renaming a symbol"
    },
    {
        name: "rename",
        description: "Rename a symbol"
    },
    {
        name: "get_code_actions",
        description: "Get available code actions and refactorings"
    },
    {
        name: "get_semantic_tokens",
        description: "Get semantic token information for code understanding"
    },
    {
        name: "get_call_hierarchy",
        description: "Get incoming and outgoing call hierarchy"
    },
    {
        name: "get_type_hierarchy",
        description: "Get type hierarchy information"
    },
    {
        name: "get_code_lens",
        description: "Gets CodeLens information for a document, showing actionable contextual information inline with code"
    },
    {
        name: "get_selection_range",
        description: "Gets selection ranges for smart selection expansion"
    },
    {
        name: "get_type_definition",
        description: "Find type definitions of symbols"
    },
    {
        name: "get_declaration",
        description: "Find declarations of symbols"
    },
    {
        name: "get_document_highlights",
        description: "Find all highlights of a symbol in document"
    },
    {
        name: "get_workspace_symbols",
        description: "Search for symbols across the workspace"
    }
];
