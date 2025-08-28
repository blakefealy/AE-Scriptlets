/**
 * @file Text_Swap.jsx
 * @name Text Swap
 * @summary Swaps the text values of two selected text layers in the active composition.
 * @author Blake Fealy
 * @version 1.2.0
 * @dependencies Requires exactly two text layers selected in the active composition.
 * @updated 2024-08-28
 * @interface none
 * @runningBool true
 */


var project = app.project;
var current = project.activeItem;
$.writeln(current.index);
var selected = current.selectedLayers;
var count = selected.length;
var propIndexArray = [];
var layerArray = [];
var sourceOne = null;
var sourceTwo = null;
var resultOne = false;
var resultTwo = false;

$.writeln(selected);


if(count === 2){
    var firstItem = selected[0];
    var secondItem = selected[1];
   
     $.writeln(firstItem.name);
     $.writeln(secondItem.name);

    prop = "property('Source Text')"
    var firstValue = null;
    var secondValue = null;
    var errors = 0;
    var alert = null;
    var numProp = null;
    for(var i = 0; i < selected.length; i++){
        var layer = selected[i];
        for(var p = 1; p <= layer.numProperties; p++){
            var prop = layer.property(p);
            $.writeln(prop);
            if(prop.name === "Text")
                layerArray.push(layer.index);
        } 
        
    }
    if(layerArray.length > 1){
        $.writeln(layerArray);
        one = layerArray[0];
        $.writeln(one);
        two = layerArray[1];
        $.writeln(two);
        valueOne = current.layer(one).property("Source Text").value.text;
        $.writeln(valueOne);
        valueTwo = current.layer(two).property("Source Text").value.text;
        $.writeln(valueTwo);

        function swapSourceText (sourceLayer, newValue){
            current.layer(sourceLayer).property('Source Text').setValue(newValue);
            return true
        }

        resultOne = swapSourceText(one, valueTwo);
        resultTwo = swapSourceText(two, valueOne);

        if(resultOne === true && resultTwo === true){
            alert("Success! \n\n The source text values: \n" + "1.)  " + valueOne + "\n&\n" + "2.)  " + valueTwo + "\n have been successfully swapped!");
        } else {
            alert("An unknown error occurred. \n text layers were not swapped \n please check script for errors");
        }

    } else {
        alert("one or more layers selected do not contain text layers, please select text layers and try again.");
    }
} else {
    if(count > 2){
    alert("Please select ONLY two text layers and try again");
    } else {
        alert ("Please select AT LEAST two text layers and try again");
    }
}





