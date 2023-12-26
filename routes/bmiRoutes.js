const express = require('express');
const router = express.Router();
const path = require('path');
const numeral = require('numeral');
const { isNumeric } = require('validator');
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'home.html'));
});

router.get('/bmicalculator', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'bmiCalculator.html'));
});

router.get('/history', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'history.html'));
});

router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'about.html'))
})

router.post('/history', (req, res) => {
    let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    res.json(history);
});

function interpretBMI(bmi) {
    if (bmi < 18.5) return 'Underweight';
    if (bmi >= 18.5 && bmi <= 24.9) return 'Normal weight';
    if (bmi >= 25 && bmi <= 29.9) return 'Overweight';
    if (bmi >= 30) return 'Obesity';
  }

router.post('/bmicalculator', (req, res) => {
    let height = req.body.Height;
    let weight = req.body.Weight;
    let age = req.body.Age;
    let gender = req.body.Gender;
    let heightUnit = req.body.HeightUnit;
    let weightUnit = req.body.WeightUnit;
    
    console.log(heightUnit, weightUnit)
    
    if (!isNumeric(height) || !isNumeric(weight)) {
      return res.status(400).json({ error: "Invalid height or weight. Please enter numbers only." });
    }

    height = parseFloat(height);
    weight = parseFloat(weight);

    console.log(height, weight);

    switch(heightUnit) {
    case 'centimeters':
        height = height / 100;
        break;
    case 'millimeters':
        height = height / 1000;
        break;
    case 'meters':
        break;
    }

    switch (weightUnit) {
        case 'grams':
            weight = weight / 1000;
            break;
        case 'kilograms':
            break;
    }

    const bmi = weight / (height * height);
//    const bmiRounded = bmi.toFixed(2);
    const req_name = req.body.Name;
    const formattedBmi = numeral(bmi).format('0.00');

    const interpretation = interpretBMI(bmi);

    let history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
    const newRecord = {
        name: req.body.Name,
        age: req.body.Age,
        gender: req.body.Gender,
        bmi: formattedBmi,
        interpretation: interpretation,
        timestamp: new Date().toISOString(),
        height: height,
        weight: weight,
        heightUnit: req.body.HeightUnit,
        weightUnit: req.body.WeightUnit
    };

    history.push(newRecord);
    localStorage.setItem('bmiHistory', JSON.stringify(history));

    res.json({name: req_name , bmi: formattedBmi, age: age, gender: gender, interpretation: interpretation});
});

module.exports = router;