/**
 * @file Sync_Item_and_Layer_Names.jsx
 * @name Sync Item & Layer Names
 * @summary Renames the source Project items of selected layers to match their layer names, or vice versa; non-source layers are skipped and reported.
 * @author Blake Fealy
 * @version 1.3.1
 * @dependencies User must have at least one layer with a valid source selected in the active composition, or one or more ProjectItems selected in the Project panel.
 * @updated 2025-08-28
 * @interface ScriptUI for ProjectItem -> Layer push
 * @runningBool false
 */

var project = app.project;
var activeComp = (project.activeItem instanceof CompItem) ? project.activeItem : null;
var selectedLayers = (activeComp) ? activeComp.selectedLayers : [];
var selectedItems = project.selection; // Project panel selection
var nLayers = [];
var alertLog = [];
var pushType = 1; // 1 = layer -> project item, 2 = project item -> layer

// -------- Helper: Alert text --------
function alertInfo(number) {
    var result = "";
    switch(number) {
        case 1: // Layer -> Project Item
            result = "✅ Successfully updated " + alertLog.length + " project items\n\n" +
                     (nLayers.length > 0 ? "⛔ Skipped (no source):\n" + "✖️ " + nLayers.join("\n✖️ ") : "");
            break;

        case 2: // Project Item -> Layer
            result = "✅ Successfully updated " + alertLog.length + " layer items\n\n" +
                     (nLayers.length > 0 ? "⛔ Skipped (no layers linked to item):\n" + "✖️ " + nLayers.join("\n✖️ ") : "");
            break;
    }
    return result;
}

// -------- Push Layer Name -> Project Item --------
if (selectedLayers.length > 0) {
    app.beginUndoGroup("Rename Project Items");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var src = layer.source;

        if (!src) {
            nLayers.push(layer.name); // skipped
        } else {
            var oldName = src.name;
            var newName = layer.name;

            src.name = newName;
            alertLog.push(oldName + " --> " + newName);
        }
    }

    app.endUndoGroup();
    pushType = 1;

// -------- Push Project Item -> Layer --------
} else if (selectedItems.length > 0) {

    // -------- Helper: ScriptUI for choosing comps --------
    function chooseCompsForPush(projectItems) {
        var compsMap = {}; // { compItem.id : { comp, layers } }

        // Find all comps containing layers linked to selected ProjectItems
        for (var i = 1; i <= project.numItems; i++) {
            var item = project.item(i);
            if (item instanceof CompItem) {
                for (var k = 1; k <= item.numLayers; k++) {
                    var layer = item.layer(k);
                    for (var p = 0; p < projectItems.length; p++) {
                        if (layer.source === projectItems[p]) {
                            if (!compsMap[item.id]) compsMap[item.id] = { comp: item, layers: [] };
                            compsMap[item.id].layers.push(layer);
                        }
                    }
                }
            }
        }

        // Check if any comps were found
        var hasComps = false;
        for (var key in compsMap) {
            if (compsMap.hasOwnProperty(key)) {
                hasComps = true;
                break;
            }
        }
        if (!hasComps) {
            alert("No layers linked to the selected ProjectItems were found in any composition.");
            return null;
        }

        // ScriptUI
        var win = new Window("dialog", "Comp Selection");
        win.orientation = "column";
        win.alignChildren = ["fill","top"];
        win.spacing = 10;
        win.margins = 15;

        win.add("statictext", undefined, "Select Comps to Update Layers")
        var checkboxes = [];
        for (var key in compsMap) {
            if (!compsMap.hasOwnProperty(key)) continue;
            var cb = win.add("checkbox", undefined, compsMap[key].comp.name);
            cb.value = true;
            checkboxes.push({ checkbox: cb, compData: compsMap[key] });
        }

        var pushBtn = win.add("button", undefined, "Push Name To Layers");

        var result = null;
        pushBtn.onClick = function() {
            result = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checkbox.value) result.push(checkboxes[i].compData);
            }
            win.close();
        }

        win.show();
        return result; // array of { comp: CompItem, layers: [Layer] }
    }

    var compsToUpdate = chooseCompsForPush(selectedItems);

    if (compsToUpdate && compsToUpdate.length > 0) {
        app.beginUndoGroup("Push ProjectItem Name To Layers");
        pushType = 2;

        for (var i = 0; i < compsToUpdate.length; i++) {
            var compData = compsToUpdate[i];
            var comp = compData.comp;
            var incrementMap = {}; // track increment per ProjectItem

            for (var j = 0; j < compData.layers.length; j++) {
                var layer = compData.layers[j];
                var src = layer.source;
                if (!incrementMap[src.id]) incrementMap[src.id] = 1;

                var newName = (incrementMap[src.id] === 1) ? src.name : src.name + " " + incrementMap[src.id];
                layer.name = newName;
                alertLog.push("Comp: " + comp.name + " | Layer " + layer.index + ": " + newName);

                incrementMap[src.id]++;
            }
        }

        app.endUndoGroup();
    }

// -------- Nothing selected --------
} else {
    alert("Please select one or more layers in a composition or one or more items in the Project panel.");
}

// -------- Final alert --------
alert(alertInfo(pushType));
