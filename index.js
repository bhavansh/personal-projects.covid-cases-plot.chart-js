
const State = document.getElementById("State");
const List = document.getElementById("stateSelect");
const SelectButton = document.getElementById("SelectState");
const ChartDiv = document.getElementById('Chart');


SelectButton.addEventListener('click', () => {

    ChartDiv.innerHTML = "";
    ChartDiv.innerHTML = "<canvas id='myChart' height='350' width='800'></canvas>";

    let SelectedValue = List.selectedOptions[0].value;
    let StateName = List.selectedOptions[0].text;
    State.textContent = StateName;
    console.log(SelectedValue);



    async function getData() {
        const covidData = await fetch('https://api.covid19india.org/states_daily.json');
        const json = await covidData.json();
        const SD = json.states_daily;

        let val, date, Confirmed, Recovered, Deceased;
        const date_c = [];
        const confirmed_c = [];
        const recovered_c = [];
        const deceased_c = [];

        let i;
        for (i = 0; i < SD.length; i = i + 3) {

            date_c.push(SD[i].date);
            confirmed_c.push(SD[i][`${SelectedValue}`]);
            recovered_c.push(SD[i + 1][`${SelectedValue}`]);
            deceased_c.push(SD[i + 2][`${SelectedValue}`]);

        }

        // console.log(confirmed_c, recovered_c, deceased_c, date_c);

        return { date_c, confirmed_c, recovered_c, deceased_c };

    }

    async function loadData() {

        const data = await getData();

        const ConfirmedData = {
            label: "Confirmed",
            data: data.confirmed_c,
            lineTension: 0,
            fill: false,
            borderColor: 'blue', borderWidth: 1,
        };
        const RecoveredData = {
            label: "Recovered",
            data: data.recovered_c,
            lineTension: 0,
            fill: false,
            borderColor: 'green', borderWidth: 1,
        };
        const DeceasedData = {
            label: "Deceased",
            data: data.deceased_c,
            lineTension: 0,
            fill: false,
            borderColor: 'red', borderWidth: 1,
        };
        const CovidData = {
            labels: data.date_c,
            datasets: [ConfirmedData, RecoveredData, DeceasedData],
        };

        // console.log(CovidData);
        return { ConfirmedData, RecoveredData, DeceasedData, CovidData };
    }

    async function chartIt() {

        const ctx = document.getElementById("myChart").getContext("2d");

        const { ConfirmedData, RecoveredData, DeceasedData, CovidData } = await loadData();
        console.log(CovidData);
        const myChart = new Chart(ctx, {
            type: "line",
            data: CovidData,
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                },
            },
        });
    }


    chartIt();




});





