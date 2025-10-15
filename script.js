async function loadSheetData() {
    const sheetUrlInput = document.getElementById("sheetUrlInput").value.trim();
    if (!sheetUrlInput) {
      alert("Please paste a valid Google Sheet CSV link!");
      return;
    }
  
    try {
      const response = await fetch(sheetUrlInput);
      if (!response.ok) throw new Error("Network response was not ok");
      const csvData = await response.text();
  
      const rows = csvData.split("\n").map(row => row.split(","));
      if (rows.length < 2) {
        alert("No data found in the sheet!");
        return;
      }
  
      // Remove header and empty rows
      const [headers, ...dataRows] = rows;
      const validRows = dataRows.filter(row => row.length >= 4 && row.join("").trim() !== "");
  
      if (validRows.length === 0) {
        alert("No valid rows found!");
        return;
      }
  
      // Update top container with the LAST row
      const lastRow = validRows[validRows.length - 1];
      document.getElementById("moistureValue").textContent = lastRow[1] || "--";
      document.getElementById("temperatureValue").textContent = lastRow[2] || "--";
      document.getElementById("phValue").textContent = lastRow[3] || "--";
  
      // Update Table
      const tableBody = document.getElementById("dataTableBody");
      tableBody.innerHTML = ""; // Clear old data
  
      validRows.forEach(row => {
        const tr = document.createElement("tr");
        row.slice(0, 4).forEach(cell => {
          const td = document.createElement("td");
          td.textContent = cell || "--";
          tr.appendChild(td);
        });
        tableBody.appendChild(tr);
      });
  
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to load data. Check the link or CORS settings.");
    }
  }
  
  // ✅ Auto-refresh every 5 seconds IF a valid link is entered
  setInterval(() => {
    const urlInput = document.getElementById("sheetUrlInput").value.trim();
    if (urlInput) {
      loadSheetData();
    }
  }, 5000);
  