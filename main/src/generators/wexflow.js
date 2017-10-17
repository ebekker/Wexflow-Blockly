/**
 * @fileoverview Helper functions for generating Wexflow for blocks.
 * @author https://github.com/ebekker
 */
'use strict';

goog.provide('Blockly.Wexflow');

goog.require('Blockly.Generator');


/**
 * Wexflow code generator.
 * @type {!Blockly.Generator}
 */
Blockly.Wexflow = new Blockly.Generator('Wexflow');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Wexflow.addReservedWords(
        // https://github.com/aelassas/Wexflow/blob/master/src/Wexflow.Core/Workflow.xsd
    'Workflow,Settings,Setting,Tasks,Task,ExecutionGraph,' +
    'Parent,Do,If,Else,While,Switch,Case,Default,OnSuccess,OnWarning,OnError' +
        // https://github.com/aelassas/Wexflow/wiki/Samples
    'true,' +
    'false'
);

// // /**
// //  * Order of operation ENUMs.
// //  * http://php.net/manual/en/language.operators.precedence.php
// //  */
// // Blockly.PHP.ORDER_ATOMIC = 0;             // 0 "" ...
// // Blockly.PHP.ORDER_CLONE = 1;              // clone
// // Blockly.PHP.ORDER_NEW = 1;                // new
// // Blockly.PHP.ORDER_MEMBER = 2.1;           // []
// // Blockly.PHP.ORDER_FUNCTION_CALL = 2.2;    // ()
// // Blockly.PHP.ORDER_POWER = 3;              // **
// // Blockly.PHP.ORDER_INCREMENT = 4;          // ++
// // Blockly.PHP.ORDER_DECREMENT = 4;          // --
// // Blockly.PHP.ORDER_BITWISE_NOT = 4;        // ~
// // Blockly.PHP.ORDER_CAST = 4;               // (int) (float) (string) (array) ...
// // Blockly.PHP.ORDER_SUPPRESS_ERROR = 4;     // @
// // Blockly.PHP.ORDER_INSTANCEOF = 5;         // instanceof
// // Blockly.PHP.ORDER_LOGICAL_NOT = 6;        // !
// // Blockly.PHP.ORDER_UNARY_PLUS = 7.1;       // +
// // Blockly.PHP.ORDER_UNARY_NEGATION = 7.2;   // -
// // Blockly.PHP.ORDER_MULTIPLICATION = 8.1;   // *
// // Blockly.PHP.ORDER_DIVISION = 8.2;         // /
// // Blockly.PHP.ORDER_MODULUS = 8.3;          // %
// // Blockly.PHP.ORDER_ADDITION = 9.1;         // +
// // Blockly.PHP.ORDER_SUBTRACTION = 9.2;      // -
// // Blockly.PHP.ORDER_STRING_CONCAT = 9.3;    // .
// // Blockly.PHP.ORDER_BITWISE_SHIFT = 10;     // << >>
// // Blockly.PHP.ORDER_RELATIONAL = 11;        // < <= > >=
// // Blockly.PHP.ORDER_EQUALITY = 12;          // == != === !== <> <=>
// // Blockly.PHP.ORDER_REFERENCE = 13;         // &
// // Blockly.PHP.ORDER_BITWISE_AND = 13;       // &
// // Blockly.PHP.ORDER_BITWISE_XOR = 14;       // ^
// // Blockly.PHP.ORDER_BITWISE_OR = 15;        // |
// // Blockly.PHP.ORDER_LOGICAL_AND = 16;       // &&
// // Blockly.PHP.ORDER_LOGICAL_OR = 17;        // ||
// // Blockly.PHP.ORDER_IF_NULL = 18;           // ??
// // Blockly.PHP.ORDER_CONDITIONAL = 19;       // ?:
// // Blockly.PHP.ORDER_ASSIGNMENT = 20;        // = += -= *= /= %= <<= >>= ...
// // Blockly.PHP.ORDER_LOGICAL_AND_WEAK = 21;  // and
// // Blockly.PHP.ORDER_LOGICAL_XOR = 22;       // xor
// // Blockly.PHP.ORDER_LOGICAL_OR_WEAK = 23;   // or
// // Blockly.PHP.ORDER_COMMA = 24;             // ,
// // Blockly.PHP.ORDER_NONE = 99;              // (...)

// // /**
// //  * List of outer-inner pairings that do NOT require parentheses.
// //  * @type {!Array.<!Array.<number>>}
// //  */
// // Blockly.PHP.ORDER_OVERRIDES = [
// //   // (foo()).bar() -> foo().bar()
// //   // (foo())[0] -> foo()[0]
// //   [Blockly.PHP.ORDER_MEMBER, Blockly.PHP.ORDER_FUNCTION_CALL],
// //   // (foo[0])[1] -> foo[0][1]
// //   // (foo.bar).baz -> foo.bar.baz
// //   [Blockly.PHP.ORDER_MEMBER, Blockly.PHP.ORDER_MEMBER],
// //   // !(!foo) -> !!foo
// //   [Blockly.PHP.ORDER_LOGICAL_NOT, Blockly.PHP.ORDER_LOGICAL_NOT],
// //   // a * (b * c) -> a * b * c
// //   [Blockly.PHP.ORDER_MULTIPLICATION, Blockly.PHP.ORDER_MULTIPLICATION],
// //   // a + (b + c) -> a + b + c
// //   [Blockly.PHP.ORDER_ADDITION, Blockly.PHP.ORDER_ADDITION],
// //   // a && (b && c) -> a && b && c
// //   [Blockly.PHP.ORDER_LOGICAL_AND, Blockly.PHP.ORDER_LOGICAL_AND],
// //   // a || (b || c) -> a || b || c
// //   [Blockly.PHP.ORDER_LOGICAL_OR, Blockly.PHP.ORDER_LOGICAL_OR]
// // ];

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Wexflow.init = function(workspace) {
  // Create a place to stash the task defs and most recent task IDs
  Blockly.Wexflow.tasks_ = [];
  Blockly.Wexflow.thisTaskId_ = -1;
  Blockly.Wexflow.lastTaskId_ = -1;

  // // // Create a dictionary of definitions to be printed before the code.
  // // Blockly.PHP.definitions_ = Object.create(null);
  // // // Create a dictionary mapping desired function names in definitions_
  // // // to actual function names (to avoid collisions with user functions).
  // // Blockly.PHP.functionNames_ = Object.create(null);

  // // if (!Blockly.PHP.variableDB_) {
  // //   Blockly.PHP.variableDB_ =
  // //       new Blockly.Names(Blockly.PHP.RESERVED_WORDS_, '$');
  // // } else {
  // //   Blockly.PHP.variableDB_.reset();
  // // }

  // // var defvars = [];
  // // var varName;
  // // var variables = Blockly.Variables.allVariables(workspace);
  // // for (var i = 0, variable; variable = variables[i]; i++) {
  // //   varName = variable.name;
  // //   defvars[i] = Blockly.PHP.variableDB_.getName(varName,
  // //       Blockly.Variables.NAME_TYPE) + ';';
  // // }
  // // Blockly.PHP.definitions_['variables'] = defvars.join('\n');
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Wexflow.finish = function(code) {
  // // // Convert the definitions dictionary into a list.
  // // var definitions = [];
  // // for (var name in Blockly.PHP.definitions_) {
  // //   definitions.push(Blockly.PHP.definitions_[name]);
  // // }
  // // // Clean up temporary data.
  // // delete Blockly.PHP.definitions_;
  // // delete Blockly.PHP.functionNames_;
  // // Blockly.PHP.variableDB_.reset();
  // // return definitions.join('\n\n') + '\n\n\n' + code;

  return "<?xml version='1.0'?>\n"
      + "<Workflow xmlns=\"urn:wexflow-schema\" id=\"1\" name=\"TBD\" description=\"TBD\">\n"
      + '\n' + code + '\n'
      + "</Workflow>";
};

Blockly.Wexflow.addTask = function(name, desc, enabled, settings) {

  var taskId = Blockly.Wexflow.tasks_.length + 1;

  if (enabled) {
    enabled = 'true'
  }
  else {
    enabled = 'false'
  }

  if (settings) {
    settings = settings.replace(/^  </gm, '    <');
  }

  var code = '  <Task id="' + taskId + '" name="' + name + '" description="' + desc
      + '" enabled="' + enabled + '">\n'
      + settings
      + '  </Task>\n';

  Blockly.Wexflow.tasks_ = Blockly.Wexflow.tasks_.concat(code);
  Blockly.Wexflow.lastTaskId_ = Blockly.Wexflow.thisTaskId_;
  Blockly.Wexflow.thisTaskId_ = taskId;
  return taskId;
}
Blockly.Wexflow.addEmpty = function() {

  var taskId = Blockly.Wexflow.tasks_.length + 1;

  Blockly.Wexflow.tasks_ = Blockly.Wexflow.tasks_.concat('');
  Blockly.Wexflow.lastTaskId_ = Blockly.Wexflow.thisTaskId_;
  Blockly.Wexflow.thisTaskId_ = taskId;
  return taskId;
}
Blockly.Wexflow.resetTaskIds = function() {
  Blockly.Wexflow.thisTaskId_ = -1;
  Blockly.Wexflow.lastTaskId_ = -1;
}

// // /**
// //  * Naked values are top-level blocks with outputs that aren't plugged into
// //  * anything.  A trailing semicolon is needed to make this legal.
// //  * @param {string} line Line of generated code.
// //  * @return {string} Legal line of code.
// //  */
// // Blockly.PHP.scrubNakedValue = function(line) {
// //   return line + ';\n';
// // };

// // /**
// //  * Encode a string as a properly escaped PHP string, complete with
// //  * quotes.
// //  * @param {string} string Text to encode.
// //  * @return {string} PHP string.
// //  * @private
// //  */
// // Blockly.PHP.quote_ = function(string) {
// //   string = string.replace(/\\/g, '\\\\')
// //                  .replace(/\n/g, '\\\n')
// //                  .replace(/'/g, '\\\'');
// //   return '\'' + string + '\'';
// // };

/**
 * Common tasks for generating PHP from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The PHP code created for this block.
 * @return {string} PHP code with comments and subsequent blocks added.
 * @private
 */
Blockly.Wexflow.scrub_ = function(block, code) {
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    comment = Blockly.utils.wrap(comment, Blockly.Wexflow.COMMENT_WRAP - 3);
    if (comment) {
      // // commentCode += Blockly.Wexflow.prefixLines(comment, '// ') + '\n';
      commentCode += comment;
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var i = 0; i < block.inputList.length; i++) {
      if (block.inputList[i].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[i].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Wexflow.allNestedComments(childBlock);
          if (comment) {
            // // commentCode += Blockly.Wexflow.prefixLines(comment, '// ');
            commentCode += comment;
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Wexflow.blockToCode(nextBlock);

  if (commentCode) {
    commentCode = '<!-- ' + commentCode + ' -->\n';
  }

  return commentCode + code + nextCode;
};

// // /**
// //  * Gets a property and adjusts the value while taking into account indexing.
// //  * @param {!Blockly.Block} block The block.
// //  * @param {string} atId The property ID of the element to get.
// //  * @param {number=} opt_delta Value to add.
// //  * @param {boolean=} opt_negate Whether to negate the value.
// //  * @param {number=} opt_order The highest order acting on this value.
// //  * @return {string|number}
// //  */
// // Blockly.PHP.getAdjusted = function(block, atId, opt_delta, opt_negate,
// //     opt_order) {
// //   var delta = opt_delta || 0;
// //   var order = opt_order || Blockly.PHP.ORDER_NONE;
// //   if (block.workspace.options.oneBasedIndex) {
// //     delta--;
// //   }
// //   var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
// //   if (delta > 0) {
// //     var at = Blockly.PHP.valueToCode(block, atId,
// //             Blockly.PHP.ORDER_ADDITION) || defaultAtIndex;
// //   } else if (delta < 0) {
// //     var at = Blockly.PHP.valueToCode(block, atId,
// //             Blockly.PHP.ORDER_SUBTRACTION) || defaultAtIndex;
// //   } else if (opt_negate) {
// //     var at = Blockly.PHP.valueToCode(block, atId,
// //             Blockly.PHP.ORDER_UNARY_NEGATION) || defaultAtIndex;
// //   } else {
// //     var at = Blockly.PHP.valueToCode(block, atId, order) ||
// //         defaultAtIndex;
// //   }

// //   if (Blockly.isNumber(at)) {
// //     // If the index is a naked number, adjust it right now.
// //     at = parseFloat(at) + delta;
// //     if (opt_negate) {
// //       at = -at;
// //     }
// //   } else {
// //     // If the index is dynamic, adjust it in code.
// //     if (delta > 0) {
// //       at = at + ' + ' + delta;
// //       var innerOrder = Blockly.PHP.ORDER_ADDITION;
// //     } else if (delta < 0) {
// //       at = at + ' - ' + -delta;
// //       var innerOrder = Blockly.PHP.ORDER_SUBTRACTION;
// //     }
// //     if (opt_negate) {
// //       if (delta) {
// //         at = '-(' + at + ')';
// //       } else {
// //         at = '-' + at;
// //       }
// //       var innerOrder = Blockly.PHP.ORDER_UNARY_NEGATION;
// //     }
// //     innerOrder = Math.floor(innerOrder);
// //     order = Math.floor(order);
// //     if (innerOrder && order >= innerOrder) {
// //       at = '(' + at + ')';
// //     }
// //   }
// //   return at;
// // };

Blockly.Wexflow.sanitizeXmlValue = function(val) {
  return val.replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
}

Blockly.Wexflow['wexflow_workflow'] = function(block) {
  var statements_settings = Blockly.Wexflow.statementToCode(block, 'SETTINGS');
  var statements_graph = Blockly.Wexflow.statementToCode(block, 'GRAPH');
  var value_events = Blockly.Wexflow.valueToCode(block, 'EVENTS', Blockly.Wexflow.ORDER_ATOMIC);

  var code = '';
  if (statements_settings) {
    code += '<Settings>\n'
        + statements_settings
        + '</Settings>\n';
  }
  if (Blockly.Wexflow.tasks_.length > 0) {
    code += '<Tasks>\n';
    Blockly.Wexflow.tasks_.forEach(function(t) {
      code += t;
    })
    code += '</Tasks>\n';
  }
  if (statements_graph) {
    code += '<ExecutionGraph>\n'
        + statements_graph
        + '</ExecutionGraph>\n';
  }
  if (value_events) {
    code += value_events;
  }
  return code;
};

Blockly.Wexflow['wexflow_workflow_setting'] = function(block) {
  var text_name = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('NAME'));
  var text_value = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('VALUE'));

  var code = '<Setting name="' + text_name + '" value="' + text_value + '" />\n';
  return code;
};

Blockly.Wexflow['wexflow_task'] = function(block) {
  var text_name = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('NAME'));
  var text_description = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('DESCRIPTION'));
  var checkbox_enabled = block.getFieldValue('ENABLED') == 'TRUE';

  var statements_settings = Blockly.Wexflow.statementToCode(block, 'SETTINGS');

  Blockly.Wexflow.addTask(text_name, text_description, checkbox_enabled, statements_settings);

  var code = '<Task id="' + Blockly.Wexflow.thisTaskId_ + '"><Parent id="' + Blockly.Wexflow.lastTaskId_ + '" /></Task>\n';

  return code;
};

Blockly.Wexflow['wexflow_task_setting'] = function(block) {
  var text_name = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('NAME'));
  var text_value = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('VALUE'));
  var code = '<Setting name="' + text_name + '" value="' + text_value + '" />\n';
  return code;
};

Blockly.Wexflow['wexflow_events'] = function(block) {

  Blockly.Wexflow.resetTaskIds();
  var statements_onsuccess = Blockly.Wexflow.statementToCode(block, 'ONSUCCESS');

  Blockly.Wexflow.resetTaskIds();
  var statements_onwarning = Blockly.Wexflow.statementToCode(block, 'ONWARNING');

  Blockly.Wexflow.resetTaskIds();
  var statements_onerror = Blockly.Wexflow.statementToCode(block, 'ONERROR');

  var code = '';
  if (statements_onsuccess) {
    code += '<OnSuccess>\n'
        + statements_onsuccess
        + '</OnSuccess>\n';
  }
  if (statements_onwarning) {
    code += '<OnWarning>\n'
        + statements_onwarning
        + '</OnWarning>\n';
  }
  if (statements_onerror) {
    code += '<OnError>\n'
        + statements_onerror
        + '</OnError>\n';
  }

  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Wexflow.ORDER_NONE];
};

// TODO:  THIS IS DUP CODE with 'wexflow_task'
Blockly.Wexflow['wexflow_task_single'] = function(block) {
  var text_name = block.getFieldValue('NAME');
  var text_description = block.getFieldValue('DESCRIPTION');
  var checkbox_enabled = block.getFieldValue('ENABLED') == 'TRUE';

  var statements_settings = Blockly.Wexflow.statementToCode(block, 'SETTINGS');

  Blockly.Wexflow.addTask(text_name, text_description, checkbox_enabled, statements_settings);

  // Singles don't return anything inline -- the block
  // they attach to will take care of rendering code
  return '';
};

Blockly.Wexflow['wexflow_graph_if'] = function(block) {
  var value_if = Blockly.Wexflow.valueToCode(block, 'IF', Blockly.Wexflow.ORDER_ATOMIC);

  var taskId = Blockly.Wexflow.thisTaskId_;
  var lastId = Blockly.Wexflow.lastTaskId_;

  Blockly.Wexflow.resetTaskIds();
  var statements_do = Blockly.Wexflow.statementToCode(block, 'DO');

  Blockly.Wexflow.resetTaskIds();
  var statements_else = Blockly.Wexflow.statementToCode(block, 'ELSE');

  var myId = Blockly.Wexflow.addEmpty();

  var code = '<If id="' + myId + '" parent="' + lastId + '" if="' + taskId + '">\n'
  if (statements_do) {
    code += '<Do>\n' + statements_do + '</Do>\n';
  }
  if (statements_else) {
    code += '<Else>\n' + statements_else + '</Else>\n';
  }
  code += '</If>\n';

  return code;
};

Blockly.Wexflow['wexflow_graph_while'] = function(block) {
  var value_while = Blockly.Wexflow.valueToCode(block, 'WHILE', Blockly.Wexflow.ORDER_ATOMIC);

  var taskId = Blockly.Wexflow.thisTaskId_;
  var lastId = Blockly.Wexflow.lastTaskId_;

  Blockly.Wexflow.resetTaskIds();
  var statements_do = Blockly.Wexflow.statementToCode(block, 'DO');

  var myId = Blockly.Wexflow.addEmpty();

  var code = '<While id="' + myId + '" parent="' + lastId + '" if="' + taskId + '">\n'
  if (statements_do) {
    code += statements_do;
  }
  code += '</While>\n';

  return code;
};

Blockly.Wexflow['wexflow_graph_switch'] = function(block) {
  var value_switch = Blockly.Wexflow.valueToCode(block, 'SWITCH', Blockly.Wexflow.ORDER_ATOMIC);

  var taskId = Blockly.Wexflow.thisTaskId_;
  var lastId = Blockly.Wexflow.lastTaskId_;

  var statements_cases = Blockly.Wexflow.statementToCode(block, 'CASES');

  Blockly.Wexflow.resetTaskIds();
  var statements_default = Blockly.Wexflow.statementToCode(block, 'DEFAULT');

  var myId = Blockly.Wexflow.addEmpty();

  var code = '<Switch id="' + myId + '" parent="' + lastId + '" if="' + taskId + '">\n'
  if (statements_cases) {
    code += statements_cases;
  }
  if (statements_default) {
    code += '<Default>\n' + statements_default + '</Default>\n';
  }
  code += '</Switch>\n';

  return code;
};

Blockly.Wexflow['wexflow_graph_switch_case'] = function(block) {
  var text_value = Blockly.Wexflow.sanitizeXmlValue(block.getFieldValue('VALUE'));

  Blockly.Wexflow.resetTaskIds();
  var statements_tasks = Blockly.Wexflow.statementToCode(block, 'TASKS');

  var code = '<Case value="' + text_value + '">\n';
  if (statements_tasks) {
    code += statements_tasks;
  }
  code += '</Case>\n';

  return code;
};