# Cursor Agent Rules for Code Modification

## 1. Pre-Edit Analysis Requirements
BEFORE making any code changes, MUST:
- Use `mcp__get_document_symbols` on the target file to understand its structure
- Use `mcp__find_usages` on any symbol being modified to identify all affected locations
- Use `mcp__get_type_definition` and/or `mcp__go_to_definition` for any types or symbols being modified
- Use `mcp__get_hover_info` to verify function signatures and type information

## 2. Impact Analysis Rules
BEFORE proceeding with changes:
1. If `mcp__find_usages` reveals usage in multiple files:
   - Must analyze each usage context
   - Must verify type compatibility across all uses
   - Must plan changes for all affected locations

2. If modifying interfaces or types:
   - Must use `mcp__find_implementations` to locate all implementations
   - Must ensure changes won't break implementing classes
   - Must verify backward compatibility or plan updates for all implementations

## 3. Type Safety Rules
MUST maintain type safety by:
1. Using `mcp__get_type_definition` for:
   - All modified parameters
   - Return types
   - Interface members
   - Generic constraints

2. Using `mcp__get_hover_info` to verify:
   - Function signatures
   - Type constraints
   - Optional vs required properties

## 4. Code Modification Sequence
When making changes:
1. First gather context:
```typescript
// Example sequence
await mcp__get_document_symbols(file)
await mcp__find_usages(symbol)
await mcp__get_type_definition(symbol)
await mcp__get_hover_info(symbol)
```

2. Then analyze impact:
```typescript
// For each usage found
await mcp__get_hover_info(usage)
await mcp__get_type_definition(relatedTypes)
```

3. Only then use `edit_file`

## 5. Post-Edit Verification
After making changes:
1. Use `mcp__get_document_symbols` to verify file structure remains valid
2. Use `mcp__find_usages` to verify all usages are still compatible
3. Use `mcp__get_hover_info` to verify new type signatures

## 6. Special Cases

### When Modifying React Components:
1. Must use `mcp__find_usages` to:
   - Find all component instances
   - Verify prop usage
   - Check for defaultProps and propTypes

2. Must use `mcp__get_type_definition` for:
   - Prop interfaces
   - State types
   - Context types

### When Modifying APIs/Functions:
1. Must use `mcp__get_call_hierarchy` to:
   - Understand the call chain
   - Identify dependent functions
   - Verify changes won't break callers

### When Modifying Types/Interfaces:
1. Must use `mcp__find_implementations` to:
   - Locate all implementing classes
   - Verify compatibility
   - Plan updates if needed

## 7. Error Prevention Rules

1. NEVER modify a symbol without first:
```typescript
await mcp__find_usages(symbol)
await mcp__get_type_definition(symbol)
```

2. NEVER modify a type without:
```typescript
await mcp__find_implementations(type)
await mcp__get_hover_info(type)
```

3. NEVER modify a function signature without:
```typescript
await mcp__get_call_hierarchy(function)
await mcp__find_usages(function)
```

## 8. Documentation Requirements

When explaining changes, must reference:
1. What tools were used to analyze the code
2. What usages were found
3. What type information was verified
4. What impact analysis was performed

Example:
```markdown
I analyzed the code using:
1. mcp__find_usages to locate all 5 usages of handleSubmit
2. mcp__get_type_definition to verify the function signature
3. mcp__get_hover_info to check parameter types
4. mcp__get_document_symbols to understand the component structure
```

## 9. Change Abort Conditions

Must ABORT changes if:
1. `mcp__find_usages` reveals unexpected usages
2. `mcp__get_type_definition` shows incompatible types
3. `mcp__find_implementations` shows breaking changes
4. Unable to verify full impact using available tools

## 10. Tool Priority Order

When analyzing code, use tools in this order:
1. `mcp__get_document_symbols` (understand structure)
2. `mcp__find_usages` (understand impact)
3. `mcp__get_type_definition` (verify types)
4. `mcp__get_hover_info` (verify signatures)
5. Additional tools as needed
