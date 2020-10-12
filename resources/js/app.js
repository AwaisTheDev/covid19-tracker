const country_name_element = document.querySelector(".country .name");
const total_cases_element = document.querySelector(".total-cases .value");
const new_cases_element = document.querySelector(".total-cases .new-value");
const recovered_element = document.querySelector(".recovered .value");
const new_recovered_element = document.querySelector(".recovered .new-value");
const deaths_element = document.querySelector(".deaths .value");
const new_deaths_element = document.querySelector(".deaths .new-value");

const chart = document.getElementById("axes_line_chart").getContext("2d");

let contryName = geoplugin_countryName();


//initialize empty Arrays
let confirmed_cases_list = [], 
	recovered_cases_list = [], 
	deaths_list = [],
	dates = [],
	formatedDates = [];

fetchData(contryName)

function fetchData(contryName){

	var country = contryName;	


	(confirmed_cases_list = []),
    (recovered_cases_list = []),
    (deaths_list = []),
    (dates = []),
	(formatedDates = []);

	var requestOptions = {
		method: 'GET',
		redirect: 'follow'
	};

	async function fetch_api(country){

		//Confirmed Cases data
		
		await fetch(`https://api.covid19api.com/total/country/${country}/status/confirmed`, requestOptions)
		.then(response => response.json())
		.then((result) => {	
			//console.log(result);
			result.forEach(entry => {
				dates.push(entry.Date);
				confirmed_cases_list.push(entry.Cases);
			});
			
			console.log(confirmed_cases_list);
			//console.log(dates);
		})
		.catch(error => console.log('error', error));

		//Recovered Cases Data 
		await fetch(`https://api.covid19api.com/total/country/${country}/status/recovered`, requestOptions)
		.then(response => response.json())
		.then((result) => {
			//console.log(result);
			result.forEach(entry => {		  
				recovered_cases_list.push(entry.Cases);
			});
			
			//console.log(recovered_cases_list);
		})
		.catch(error => console.log('error', error));
	
		//Deaths Data
		await fetch(`https://api.covid19api.com/total/country/${country}/status/deaths`, requestOptions)
		.then(response => response.json())
		.then((result) => {
			//console.log(result);
			result.forEach(entry => {		  
				deaths_list.push(entry.Cases);
			});
			
			//console.log(deaths_list);
		})
		.catch(error => console.log('error', error));

	//update Results in frontend
	updateUI();
	}

	fetch_api(country);	
	country_name_element.innerHTML =  country; 
  
}
function updateUI(){
	updateStats();
	updateChart();
}

function updateStats(){

	var total_cases = confirmed_cases_list[confirmed_cases_list.length - 1 ];	
	var new_cases =  confirmed_cases_list[confirmed_cases_list.length - 1 ] - confirmed_cases_list[confirmed_cases_list.length - 2 ];
	total_cases_element.innerHTML = total_cases;
	new_cases_element.innerHTML = `+${new_cases}`;
	
	var total_recovered_cases = recovered_cases_list[recovered_cases_list.length - 1 ];	
	var new_recovered_cases =  recovered_cases_list[recovered_cases_list.length - 1 ] - recovered_cases_list[recovered_cases_list.length - 2 ];
	recovered_element.innerHTML = total_recovered_cases;
	new_recovered_element.innerHTML = `+${new_recovered_cases}`;
	
	var total_death_cases = deaths_list[deaths_list.length - 1 ];	
	var new_death_cases =  deaths_list[deaths_list.length - 1 ] - deaths_list[deaths_list.length - 2 ];
	deaths_element.innerHTML = total_death_cases;
	new_deaths_element.innerHTML = `+${new_death_cases}`;

	dates.forEach(date => {
		formatedDates.push(formatDates(date));
	});

	console.log(formatedDates);
}

let myChart;
function updateChart(){
	if(myChart){
		myChart.destroy();
	}

	myChart =  new Chart(chart , {
		type : 'line',
		data : {
			datasets:[
				{
					label : 'Cases',
					data : confirmed_cases_list,
					fill: false,
					borderColor: "#FFF",
					backgroundColor: "#FFF",
					borderWidth: 1,
				},
				{
					label : 'Recovered',
					data : recovered_cases_list,
					fill: false,
					borderColor: "#009688",
					backgroundColor: "#009688",
					borderWidth: 1,
				},
				{
					label : 'Deaths',
					data : deaths_list,
					fill: false,
					borderColor: "#f44336",
					backgroundColor: "#f44336",
					borderWidth: 1,
				}
			],
			labels : formatedDates,

		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			},
	})

}

var months = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec",
]


function formatDates(dateString){
	var date = new Date(dateString);

	return `${date.getDate()} ${months[date.getMonth() -1 ]}`;
	
}