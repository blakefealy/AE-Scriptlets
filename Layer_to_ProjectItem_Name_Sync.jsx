/**
 * @file Layer_to_ProjectItem_Name_Sync.jsx
 * @name Push Layer Name to Project Item
 * @summary Renames the source Project items of selected layers to match their layer names; non-source layers are skipped and reported.
 * @author Blake Fealy
 * @version 1.0.0
 * @dependencies User must have at least one layer with a valid source selected in the active composition.
 * @updated 2025-08-28
 * @interface none
 * @runningBool false
 */


var project = app.project;
var comp = project.activeItem;
var selectedLayers = (comp && comp.selectedLayers) ? comp.selectedLayers : [];
var nLayers = [];
var sdkLog = [];

if (selectedLayers.length > 0) {
    app.beginUndoGroup("Rename Project Items");

    for (var i = 0; i < selectedLayers.length; i++) {
        var layer = selectedLayers[i];
        var src = layer.source;

        if (!src) {
            // no linked project item (e.g. text, shape, camera, etc.)
            nLayers.push(layer.name);
        } else {
            var oldName = src.name;
            var newName = layer.name;

            src.name = newName;

            if (src.name === newName) {
                sdkLog.push(oldName + " --> " + newName);
            }
        }
    }

    app.endUndoGroup();
} else {
    alert("Please select one or more layers to push changes to the project items");
}

if (sdkLog.length > 0 || nLayers.length > 0) {
    alert(
         " ✅ Successfully updated " + sdkLog.length + " project items\n\n" +
        (nLayers.length > 0 ? " ⛔ Skipped (no source):\n" + "           ✖️ " + nLayers.join("\n           ✖️ ") : "")
    );
}
