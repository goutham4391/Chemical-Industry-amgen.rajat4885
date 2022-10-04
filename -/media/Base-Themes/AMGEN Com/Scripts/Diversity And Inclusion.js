$(document).ready(function () {

    var fired = false;

    $('#drawChartsTrigger').waypoint({
        handler: function () {
            console.log('waypoint reached');
            if (!fired) {
                drawCharts();
                setTimeout(function() {
                    $('.chartNumbers').fadeIn({duration: 1000});
                }, 500)

                fired = true;
            }

        },
       offset: -150
    })

    function drawCharts() {
        new Chart(document.getElementById("chartjs-1"), {
            "type": "doughnut",
            "options": {
                "tooltips": {
                    "enabled": false
                    }
                },
                "animation": {
                    duration: 3000
            },
            "data": {
                "labels": ["Minorities"],
                "datasets": [{
                    "label": "My First Dataset",
                    "data": [35, 65],
                    "backgroundColor": ["rgb(0,99,195)", "rgb(255, 255, 255)"],
                    "borderColor": ["rgb(0, 0, 0, .5)","rgb(0, 0, 0, .5)"],
                    "borderWidth": [1,1]
                }]
            }
        });

        new Chart(document.getElementById("chartjs-2"), {
            "type": "doughnut",
            "options": {
                "tooltips": {
                    "enabled": false
                }
            },
            "animation": {
                duration: 3000
            },
            "data": {
                "labels": ["Women"],
                "datasets": [{
                    "label": "My First Dataset",
                    "data": [52, 49],
                    "backgroundColor": ["rgb(0,99,195)", "rgb(255, 255, 255)"],
                    "borderColor": ["rgb(0, 0, 0, .5)","rgb(0, 0, 0, .5)"],
                    "borderWidth": [1,1]
                }]
            }
        });

        new Chart(document.getElementById("chartjs-3"), {
            "type": "doughnut",
            "options": {
                "tooltips": {
                    "enabled": false
                }
            },
            "animation": {
                duration: 3000
            },
            "data": {
                "labels": ["U.S. Managers"],
                "datasets": [{
                    "label": "My First Dataset",
                    "data": [74, 26],
                    "backgroundColor": ["rgb(0,99,195)", "rgb(255, 255, 255)"],
                    "borderColor": ["rgb(0, 0, 0, .5)","rgb(0, 0, 0, .5)"],
                    "borderWidth": [1,1]
                }]
            }
        });
    }

})



