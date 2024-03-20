const goToPage = document.getElementById("goto");
const getTypes = document.getElementById("get");
const download = document.getElementById("load");
const txt = document.getElementById("text");
let loadingAnimationIndex = 0 // This is for the loading animation

// Returns current tab id
async function getCurrentTab() {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	return tab.id;
} 

// Fetches ACFT Types JSON
async function getAcftTypes(){
	const getAcftTypes = await fetch("https://www4.icao.int/doc8643/External/AircraftTypes",
		{
			"method": "POST"
		}
	)
	const acftTypes = await getAcftTypes.json()
	return acftTypes
}

// Happy little loading animation
function loadingAnimation(){
	if(loadingAnimationIndex === 0){
		txt.innerText = "Fetching data \u2014"
	  loadingAnimationIndex++
	}	
	else if(loadingAnimationIndex === 1){
		txt.innerText = "Fetching data \\"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 2){
		txt.innerText = "Fetching data |"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 3){
		txt.innerText = "Fetching data /"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 4){
		txt.innerText = "Fetching data \u2014"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 5){
		txt.innerText = "Fetching data \\"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 6){
		txt.innerText = "Fetching data |"
	  loadingAnimationIndex++
	}
	else if(loadingAnimationIndex === 7){
		txt.innerText = "Fetching data /"
	  loadingAnimationIndex = 0
	}
}

// Navigates current tab to ICAO Website
goToPage.addEventListener("click", async function(){
	chrome.tabs.update(await getCurrentTab(), {
		url: "https://www.icao.int/publications/DOC8643/Pages/Search.aspx"
	}).then(()=>{
		getTypes.disabled = false
	})
})

// The event handler that invokes the ACFT Types request
getTypes.addEventListener("click", async function(){

	// Loading state 
	txt.innerText = "Fetching data"
	const interval = setInterval(loadingAnimation, 200)	
	
	// Gets current tab
	const tab = await getCurrentTab()
	chrome.scripting.executeScript({
		target: {tabId: await getCurrentTab()},
		func: getAcftTypes,
	})
	.then(injectionResults => {
		for (const {frameId, result} of injectionResults) {
			// Throws error if request isnt made from ICAO domain and/or fails by returning null
			if(result === null){
				throw new Error('No data could be fetched.');
			}
			// Clears loading animation and displays fetch result
			clearInterval(interval)
			txt.innerText = `Fetched ${result.length} ACFT Types!`
			
			// Sets up the file to be downloaded
			const date = new Date()
			const fileName = `ICAO 8643 ACFT Types ${date.toISOString().split("T")[0]}`
			const fileContent = JSON.stringify(result)
			const file = new Blob([fileContent], {type: 'application/json'});

			// Serves the file for downloading
			window.URL = window.URL || window.webkitURL;
			download.setAttribute("href", window.URL.createObjectURL(file));
			download.disabled = false
			download.setAttribute("download", fileName);
			
			//Downloads the file
			download.addEventListener("click", async function(){
				const options = {
					suggestedName: `ICAO 8643 ACFT TYPES ${date.toISOString().split("T")[0]}.json`,
					types: [
						{
							accept: {
								'text/json': ['.json']
							},
						}
					],
				};
				
				const handle = await window.showSaveFilePicker(options);
				const writable = await handle.createWritable();
				await writable.write(file);
				await writable.close();
			});
		}
	})
	.catch(error =>{
		clearInterval(interval)
		txt.innerText = `${error}`
	})
})

