Blockly.Blocks['wexflow_workflow'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("WORKFLOW");
      this.appendStatementInput("SETTINGS")
          .setCheck("type-wexflow_workflow_setting")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("settings");
      this.appendStatementInput("GRAPH")
          .setCheck("type-wexflow_graph_node")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("tasks");
      this.appendValueInput("EVENTS")
          .setCheck("type-wexflow_events")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("events");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_workflow_setting'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Workflow Setting:")
          .appendField(new Blockly.FieldTextInput("name"), "NAME")
          .appendField("Value:")
          .appendField(new Blockly.FieldTextInput("default"), "VALUE");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "type-wexflow_workflow_setting");
      this.setNextStatement(true, "type-wexflow_workflow_setting");
      this.setColour(15);
   this.setTooltip("Configures a named setting for the associated Workflow");
   this.setHelpUrl("https://github.com/aelassas/Wexflow/wiki/Samples");
    }
  };
  
  Blockly.Blocks['wexflow_task'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Task")
          .appendField(new Blockly.FieldTextInput("name"), "NAME")
          .appendField("Enabled:")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "ENABLED")
          .appendField("Desc:")
          .appendField(new Blockly.FieldTextInput(""), "DESCRIPTION");
      this.appendStatementInput("SETTINGS")
          .setCheck("type-wexflow_task_setting")
          .appendField("Settings");
      this.setPreviousStatement(true, "type-wexflow_graph_node");
      this.setNextStatement(true, "type-wexflow_graph_node");
      this.setColour(285);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_task_setting'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Task Setting:")
          .appendField(new Blockly.FieldTextInput("name"), "NAME")
          .appendField("Value:")
          .appendField(new Blockly.FieldTextInput("default"), "VALUE");
      this.setInputsInline(true);
      this.setPreviousStatement(true, "type-wexflow_task_setting");
      this.setNextStatement(true, "type-wexflow_task_setting");
      this.setColour(270);
   this.setTooltip("Configures a named setting for the associated Workflow");
   this.setHelpUrl("https://github.com/aelassas/Wexflow/wiki/Samples");
    }
  };
  
  Blockly.Blocks['wexflow_events'] = {
    init: function() {
      this.appendStatementInput("ONSUCCESS")
          .setCheck("type-wexflow_graph_node")
          .appendField("OnSuccess");
      this.appendStatementInput("ONWARNING")
          .setCheck("type-wexflow_graph_node")
          .appendField("OnWarning");
      this.appendStatementInput("ONERROR")
          .setCheck("type-wexflow_graph_node")
          .appendField("OnError");
      this.setOutput(true, "type-wexflow_events");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_task_single'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("Task")
          .appendField(new Blockly.FieldTextInput("name"), "NAME")
          .appendField("Enabled:")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "ENABLED")
          .appendField("Desc:")
          .appendField(new Blockly.FieldTextInput(""), "DESCRIPTION");
      this.appendStatementInput("SETTINGS")
          .setCheck("type-wexflow_task_setting")
          .appendField("Settings");
      this.setOutput(true, "type-wexflow_task_single");
      this.setColour(270);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_graph_if'] = {
    init: function() {
      this.appendValueInput("IF")
          .setCheck("type-wexflow_task_single")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("IF");
      this.appendStatementInput("DO")
          .setCheck("type-wexflow_graph_node")
          .appendField("then");
      this.appendStatementInput("ELSE")
          .setCheck("type-wexflow_graph_node")
          .appendField("else");
      this.setPreviousStatement(true, "type-wexflow_graph_node");
      this.setNextStatement(true, "type-wexflow_graph_node");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_graph_while'] = {
    init: function() {
      this.appendValueInput("WHILE")
          .setCheck("type-wexflow_task_single")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("WHILE");
      this.appendStatementInput("DO")
          .setCheck("type-wexflow_graph_node")
          .appendField("do");
      this.setPreviousStatement(true, "type-wexflow_graph_node");
      this.setNextStatement(true, "type-wexflow_graph_node");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_graph_switch'] = {
    init: function() {
      this.appendValueInput("SWITCH")
          .setCheck("type-wexflow_task_single")
          .setAlign(Blockly.ALIGN_RIGHT)
          .appendField("SWITCH");
      this.appendStatementInput("CASES")
          .setCheck("type-wexflow_graph_switch_case")
          .appendField("cases:");
      this.appendStatementInput("DEFAULT")
          .setCheck("type-wexflow_graph_node")
          .appendField("default:");
      this.setPreviousStatement(true, "type-wexflow_graph_node");
      this.setNextStatement(true, "type-wexflow_graph_node");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };
  
  Blockly.Blocks['wexflow_graph_switch_case'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("CASE")
          .appendField(new Blockly.FieldTextInput("value"), "VALUE");
      this.appendStatementInput("TASKS")
          .setCheck("type-wexflow_graph_node");
      this.setPreviousStatement(true, "type-wexflow_graph_switch_case");
      this.setNextStatement(true, "type-wexflow_graph_switch_case");
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };