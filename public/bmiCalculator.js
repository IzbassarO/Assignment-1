$(document).ready(function() {
    $('#bmiForm').on('submit', function(e) {
        e.preventDefault();
        console.log("Starting showing");
        $.ajax({
            type: 'POST',
            url: '/bmiCalculator',
            data: $(this).serialize(),
            success: function(data) {
                console.log("AJAX Success, received data:", data);

                if(data.error) {
                    alert(data.error);
                } else {
                    $('#bmiModalLabel').text('BMI Result');
                    $('.modal-body').html(`<p>Dear ${data.name}, your BMI is ${data.bmi} (${data.interpretation}).</p> <p>Name: ${data.name}</p> <p>Age: ${data.age}</p> <p>Gender: ${data.gender}</p>`);
                    $('#bmiResultModal').modal('show');

                    console.log("Showed and openning the savehistory");

                    saveHistory(data);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('Error:', textStatus, errorThrown);
                alert('Error: ' + textStatus + ' - ' + errorThrown);
            }
        });
    });

    function saveHistory(data) {
        console.log("Entering saveHistory function", data); 


        let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];


        history.push({
            name: data.name,
            age: data.age,
            gender: data.gender,
            bmi: data.bmi,
            interpretation: data.interpretation,
            timestamp: new Date().toISOString(),
            height: $('input[name="Height"]').val(),
            heightUnit: $('select[name="HeightUnit"]').val(),
            weight: $('input[name="Weight"]').val(),
            weightUnit: $('select[name="WeightUnit"]').val()
        });

        localStorage.setItem('bmiHistory', JSON.stringify(history));

        console.log("History saved:", history);
    }


    loadHistory();

    function loadHistory() {
        let history = JSON.parse(localStorage.getItem('bmiHistory')) || [];
        let historyHtml = history.map(entry => `
            <tr>
                <td>${entry.name}</td>
                <td>${entry.age}</td>
                <td>${entry.gender}</td>
                <td>${new Date(entry.timestamp).toLocaleString()}</td>
                <td>${entry.bmi}</td>
                <td>${entry.height} ${entry.heightUnit}</td>
                <td>${entry.weight} ${entry.weightUnit}</td>
            </tr>
        `).join('');
        $('#historyContent').html(historyHtml);
    }
});

$(document).ready(function() {
    loadHistory();
});
