const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });

    mainWindow.loadFile("index.html");
});

ipcMain.on("saveData", async (event, formData) => {
    console.log("🔹 Data received in main process:", formData);

    const filePath = path.join(app.getPath("documents"), "DBJ_Data.xlsx");
    let workbook, worksheet, existingData = [];

    try {
        if (fs.existsSync(filePath)) {
            workbook = XLSX.readFile(filePath);
            worksheet = workbook.Sheets["Users"];
            if (worksheet) {
                existingData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            } else {
                worksheet = XLSX.utils.aoa_to_sheet([]);
                XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
            }
        } else {
            workbook = XLSX.utils.book_new();
            worksheet = XLSX.utils.aoa_to_sheet([]);
            XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
        }

        // ✅ **Headers Add Karna Agar Missing Hain**
        if (existingData.length === 0) {
            existingData.push([
                "DBJ Id.",
                "Envelope No.",
                "Form No.",
                "Aadhar Card Number",
                "Pan Card Number",
                "Name",
                "Father's Name",
                "Mother's Name",
                "H.O.F Member",
                "Date Of Birth",
                "Contact",
                "Family Name",
                "Email",
                "Gender",
                "Spouse Name",
                "Relation with H.O.F",
                "Marital Status",
                "WhatsApp Number",
                "Address",
                "Blood Group",
                "Education",
                "Occupation",
                "Income",
                "Area",
                "Sub-Area",
                "Masjid",
                "Country",
                "State",
                "City",
            ])
        }

        existingData.push([
            formData["dbj-id"],
            formData["envelope-no"],
            formData["form-no"],
            formData["aadharCard-Number"],
            formData["panCard-Number"],
            formData["full-name"],
            formData["father-name"],
            formData["mother-name"],
            formData["hof"],
            formData["birthday"],
            formData["contact"],
            formData["family-name"],
            formData["email"],
            formData["gender"],
            formData["spouse-name"],
            formData["relation-hof"],
            formData["marital-Status"],
            formData["whatsApp-Number"],
            formData["address"],
            formData["bloodGroup"],           
            formData["education"],
            formData["occupation"],
            formData["income"],
            formData["area"],
            formData["subArea"],
            formData["masjid"],
            formData["country"],
            formData["state"],
            formData["city"],
        ]);

        worksheet = XLSX.utils.aoa_to_sheet(existingData);
        workbook.Sheets["Users"] = worksheet;

        // ✅ **Headers Ko Bold & Center Align Karna**
        const range = XLSX.utils.decode_range(worksheet["!ref"]);
        for (let C = range.s.c; C <= range.e.c; C++) {
            const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[cell_address]) continue;
            worksheet[cell_address].s = { font: { bold: true }, alignment: { horizontal: "center" } };
        }

        console.log("🔹 Writing data to Excel file...");

        // ✅ **Non-Blocking Save Operation**
        // ✅ **Async Save Operation**
        await new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    XLSX.writeFile(workbook, filePath);
                    console.log("✅ Excel file saved successfully.");
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }, 10);
        });

        //  ✅ Send confirmation message
        event.reply("excelUpdated", `✅ Data saved successfully at: ${filePath}`);

    } catch (error) {
        console.error("❌ Error saving Excel file:", error);
        event.reply("excelUpdated", `❌ Error saving data: ${error.message}`);
    }
});
