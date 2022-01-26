import { Chart, registerables } from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import './chart.css'
Chart.register(...registerables);


function BarChart() {
    const inputRef1 = useRef()
    const [date, setDate] = useState('')
    const [loading, setLoading] = useState('')

    // First chart date labels and value
    let dateLabels = []
    let previousDateSchedules = []

    // Data
    const [schedules, setSchedules] = useState()

    useEffect(() => {
        const fetchData = async () => {
            fetch('./fakeDta.json')
                .then(res => res.json())
                .then(data => setSchedules(data))
                .finally(() => setLoading(false))
        };

        fetchData();
    }, [])

    if (!schedules) {
        return <div>Loading</div>
    }


    // Bar chart option
    let options = {
        scales: {
            y: {
                max: 10,
                ticks: {
                    stepSize: 1
                }
            }
        }
    };


    // Chart 1 Function Start
    const schedulesByDate = (date) => {
        let dbItemDate = date;
        let otherDayArray = schedules.filter(num => num.item_date < dbItemDate);
        let count = otherDayArray.reduce(function (acc, num) {

            acc[num.item_date] = (acc[num.item_date] || 0) + 1;
            return acc;
        }, []);
        console.log(count);//this should print the frequency of each date in the others date array 
        return count


    }

    const chart2 = schedulesByDate(date)

    Object.entries(chart2).map(
        ([key, value]) => {
            dateLabels.push(key);
            previousDateSchedules.push(value)

        }
    )
    // Chart 1 Function End


    //function to get Chart 2 result
    let getScheduleCounter = (date) => {
        let scheduleCounter = {
            '9_12': [],
            '12_3': [],
            '3_6': [],
            '6_9': []
        };

        schedules.forEach(sch => {
            if (sch.item_date === date) {
                updateScheduledCounter(sch, scheduleCounter);
            }
        });

        return scheduleCounter;
    }

    //function to get the count and update in scheduleCounter 
    let updateScheduledCounter = (sch, scheduleCounter) => {
        let time = sch.schedule_time.split(' ')[1];
        switch (!!time) {
            case (time <= '12:00:00'):
                scheduleCounter['9_12']++;
                break;

            case (time >= '12:00:00' && time <= '15:00:00'):
                scheduleCounter['12_3']++;
                break;

            case (time >= '15:00:00' && time <= '18:00:00'):
                scheduleCounter['3_6']++;
                break;

            case (time >= '18:00:00' && time <= '21:00:00'):
                scheduleCounter['6_9']++;
                break;
        }
    }

    let schedulesTimes = []
    let schedulesTimesValues = []

    let schedule = getScheduleCounter(date);
    console.log('schedules: ', schedule);


    Object.entries(schedule).map(
        ([key, value]) => {
            schedulesTimes.push(key);
            schedulesTimesValues.push(value)

        }
    )

    console.log(schedulesTimes, schedulesTimesValues);



    return (
        <div className="container">

            {
                loading ? <h2>Loading...</h2> : <>
                    <div className="bar">
                        <div classNam="chart-container" style={{ position: "relative", height: "550px", width: "40vw" }}>
                            <h2>Item Dates</h2>
                            <Bar
                                id="myChart"

                                data={{
                                    labels: dateLabels,
                                    datasets: [{
                                        label: 'Scheduled',
                                        data: previousDateSchedules,
                                        backgroundColor: [
                                            'rgba(255, 26, 104, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(255, 206, 86, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                            'rgba(153, 102, 255, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(0, 0, 0, 0.2)'
                                        ],
                                        borderColor: [
                                            'rgba(255, 26, 104, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(153, 102, 255, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(0, 0, 0, 1)'
                                        ],
                                        borderWidth: 1
                                    }]
                                }}

                                options={options}
                            />
                        </div>
                        <div className="chart-container" style={{ position: "relative", height: "550px", width: "40vw" }}>
                            <h2>{date} Schedules</h2>
                            <Bar
                                id="myChart"
                                data={{
                                    labels: ['9am to 12pm', '12pm to 3pm', '3pm to 6pm', '6pm to 9pm'],
                                    datasets: [{
                                        label: 'Scheduled',
                                        data: schedulesTimesValues,
                                        backgroundColor: [
                                            'rgba(255, 26, 104, 0.2)',
                                            'rgba(54, 162, 235, 0.2)',
                                            'rgba(255, 206, 86, 0.2)',
                                            'rgba(75, 192, 192, 0.2)',
                                            'rgba(153, 102, 255, 0.2)',
                                            'rgba(255, 159, 64, 0.2)',
                                            'rgba(0, 0, 0, 0.2)'
                                        ],
                                        borderColor: [
                                            'rgba(255, 26, 104, 1)',
                                            'rgba(54, 162, 235, 1)',
                                            'rgba(255, 206, 86, 1)',
                                            'rgba(75, 192, 192, 1)',
                                            'rgba(153, 102, 255, 1)',
                                            'rgba(255, 159, 64, 1)',
                                            'rgba(0, 0, 0, 1)'
                                        ],
                                        borderWidth: 1
                                    }]
                                }}

                                options={options}
                            />
                        </div>
                    </div>


                    <div>
                        <input type="date" ref={inputRef1} defaultValue='2021-05-18' />
                        <button onClick={() => setDate(inputRef1.current.value)}>Filter</button>
                    </div>

                    <p>Note: The provided JSON data is not working, it's showing cors error. That's why I created few data. The data is available from 2021-05-18 to 2021-05-22 </p>
                </>

            }
        </div>
    );
}

export default BarChart;