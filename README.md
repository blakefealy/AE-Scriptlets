# About
A collection of short After Effects scriptlets designed to speed up everyday workflows.  
Each script can be run via **Window > [Script Name]** (if installed as a ScriptUI Panel),  
**File > Scripts > [Script Name]**, or through a script runner extension like **KBar**.

---

## Installing Scriptlets into AE
1. Download or clone this repository.  
2. Copy the desired `.jsx` (or `.jsxbin`) files into one of these folders:  
   - **MacOS:** `/Applications/Adobe After Effects [version]/Scripts/`  
   - **Windows:** `C:\Program Files\Adobe\Adobe After Effects [version]\Support Files\Scripts\`  
3. Restart After Effects.  
4. Run the script from **File > Scripts** or dock it as a panel from **Window > [Script Name]**.  
5. (Optional) Add to **KBar** or another launcher for quick access.

---
## Scriptlets

### Text Swap
Swaps the text values of two selected text layers in the active composition. Requires exactly two text layers to be selected. Layers that are not text layers will be ignored, and the script will display an alert if the selection is invalid.

### Push Layer Name to Project Item
Renames the source Project items of selected layers to match their layer names; non-source layers are skipped and reported.

### Sync Item and Layer Name
An extended version of Push Layer Name to Project Item. When the timeline panel is active, it renames the source Project items of selected layers to match their layer names. When the Project panel is active and a project item is selected, it presents a list of all comps containing that item, allowing the user to selectively push the project item’s name to its linked layers. Because this can be destructive or create unintended results, it’s provided as a separate, feature-rich alternative.

---

## License & Usage
These scripts were developed by **Blake Fealy** and are free for both personal and professional use.  
Attribution is appreciated but not required.
