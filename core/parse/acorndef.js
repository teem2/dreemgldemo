// Copyright 2015 Teem2 LLC, MIT License (see LICENSE)
// Acorn AST structure definition

define({
	Program:{ body:2 },
	BinaryExpression:{left:1, right:1, operator:0},
	ExpressionStatement:{expression:1},
	MemberExpression:{object:1, property:1, computed:0},
	CallExpression:{callee:1, arguments:2},
	LogicalExpression:{left:1, right:1, operator:0},
	BinaryExpression:{left:1, right:1, operator:0},
	Identifier:{name:0},
	Literal:{raw:0, value:0},
	ThisExpression:{},
	AssignmentExpression: {left:1, right:1},
	FunctionDeclaration: {id:1, params:2, body:1},
	BlockStatement:{body:2},
	VariableDeclaration:{declarations:2, kind:0},
	VariableDeclarator:{id:1, init:1},
	FunctionExpression:{id:1, params:2},
	ObjectExpression:{properties:3},
	ArrayExpression:{elements:2},
	NewExpression:{callee:1, arguments:2},
	ConditionalExpression:{test:1, consequent:1, alternate:1},
	UpdateExpression:{operator:0, prefix:0, argument:1},
	SwitchStatement:{discriminant:1, cases:2},
	SwitchCase:{test:1, consequent:1},
	ReturnStatement:{argument:1},
	ThrowStatement:{argument:1},
	TryStatement:{block:1, handlers:2, finalizer:1},
	CatchClause:{param:1, guard:1, body:1},
	AwaitExpression:{argument:1},
	UnaryExpression:{operator:0, prefix:0, argument:1},
	IfStatement:{test:1, consequent:1},
	ForStatement:{init:1, test:1, update:1, body:1},
	EmptyStatement:{}
})