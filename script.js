document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const categorySelector = document.querySelector('.category-selector');
    const fromUnitSelector = document.getElementById('from-unit');
    const toUnitSelector = document.getElementById('to-unit');
    const inputValue = document.getElementById('input-value');
    const outputValue = document.getElementById('output-value');
    const swapBtn = document.querySelector('.swap-btn');
    const historyList = document.querySelector('.history-list');

    // Conversion factors (in meters, grams, etc. as base units)
    const conversionFactors = {
        length: {
            meter: 1,
            kilometer: 1000,
            centimeter: 0.01,
            millimeter: 0.001,
            mile: 1609.34,
            yard: 0.9144,
            foot: 0.3048,
            inch: 0.0254
        },
        weight: {
            kilogram: 1,
            gram: 0.001,
            milligram: 0.000001,
            pound: 0.453592,
            ounce: 0.0283495,
            ton: 1000
        },
        temperature: {
            celsius: 1,
            fahrenheit: 1, // Special handling
            kelvin: 1      // Special handling
        },
        area: {
            squareMeter: 1,
            squareKilometer: 1000000,
            squareMile: 2589988.11,
            squareYard: 0.836127,
            squareFoot: 0.092903,
            squareInch: 0.00064516,
            hectare: 10000,
            acre: 4046.86
        },
        volume: {
            liter: 1,
            milliliter: 0.001,
            cubicMeter: 1000,
            gallon: 3.78541,
            quart: 0.946353,
            pint: 0.473176,
            cup: 0.24,
            fluidOunce: 0.0295735,
            tablespoon: 0.0147868,
            teaspoon: 0.00492892
        },
         time: {
            hour: 1,
            miniute: 1/60,
            second:1/3600,
            millisecond:1/3600000,
            }
    };

    // Unit labels for display
    const unitLabels = {
        length: {
            meter: 'Meter (m)',
            kilometer: 'Kilometer (km)',
            centimeter: 'Centimeter (cm)',
            millimeter: 'Millimeter (mm)',
            mile: 'Mile (mi)',
            yard: 'Yard (yd)',
            foot: 'Foot (ft)',
            inch: 'Inch (in)'
        },
        weight: {
            kilogram: 'Kilogram (kg)',
            gram: 'Gram (g)',
            milligram: 'Milligram (mg)',
            pound: 'Pound (lb)',
            ounce: 'Ounce (oz)',
            ton: 'Ton (t)'
        },
        temperature: {
            celsius: 'Celsius (°C)',
            fahrenheit: 'Fahrenheit (°F)',
            kelvin: 'Kelvin (K)'
        },
        area: {
            squareMeter: 'Square Meter (m²)',
            squareKilometer: 'Square Kilometer (km²)',
            squareMile: 'Square Mile (mi²)',
            squareYard: 'Square Yard (yd²)',
            squareFoot: 'Square Foot (ft²)',
            squareInch: 'Square Inch (in²)',
            hectare: 'Hectare (ha)',
            acre: 'Acre (ac)'
        },
        volume: {
            liter: 'Liter (L)',
            milliliter: 'Milliliter (mL)',
            cubicMeter: 'Cubic Meter (m³)',
            gallon: 'Gallon (gal)',
            quart: 'Quart (qt)',
            pint: 'Pint (pt)',
            cup: 'Cup (cup)',
            fluidOunce: 'Fluid Ounce (fl oz)',
            tablespoon: 'Tablespoon (tbsp)',
            teaspoon: 'Teaspoon (tsp)'
        },
         time: {
            hour: 'Hour (hr)',
            miniute: 'Miniute(m)',
            second: 'Second (s)',
            millisecond: 'Milliseconds (ms)'
        }
    };

    // Initialize the converter
    initConverter();

    // Event Listeners
    categorySelector.addEventListener('change', updateUnitSelectors);
    fromUnitSelector.addEventListener('change', convert);
    toUnitSelector.addEventListener('change', convert);
    inputValue.addEventListener('input', convert);
    swapBtn.addEventListener('click', swapUnits);

    // Initialize the converter
    function initConverter() {
        updateUnitSelectors();
        convert();
    }

    // Update unit selectors based on category
    function updateUnitSelectors() {
        const category = categorySelector.value;
        const units = Object.keys(conversionFactors[category]);
        
        // Clear existing options
        fromUnitSelector.innerHTML = '';
        toUnitSelector.innerHTML = '';
        
        // Add new options
        units.forEach(unit => {
            const option1 = document.createElement('option');
            option1.value = unit;
            option1.textContent = unitLabels[category][unit];
            fromUnitSelector.appendChild(option1);
            
            const option2 = document.createElement('option');
            option2.value = unit;
            option2.textContent = unitLabels[category][unit];
            toUnitSelector.appendChild(option2);
        });
        
        // Set default "to" unit to something different than "from"
        if (units.length > 1) {
            toUnitSelector.selectedIndex = 1;
        }
        
        convert();
    }

    // Perform the conversion
    function convert() {
        const category = categorySelector.value;
        const fromUnit = fromUnitSelector.value;
        const toUnit = toUnitSelector.value;
        const input = parseFloat(inputValue.value) || 0;
        
        let result;
        
        // Special handling for temperature
        if (category === 'temperature') {
            result = convertTemperature(input, fromUnit, toUnit);
        } else {
            // Convert to base unit first, then to target unit
            const valueInBaseUnit = input * conversionFactors[category][fromUnit];
            result = valueInBaseUnit / conversionFactors[category][toUnit];
        }
        
        // Round to 6 decimal places
        result = Math.round(result * 1000000) / 1000000;
        
        outputValue.value = result;
        
        // Add to history if input is valid
        if (input !== 0) {
            addToHistory(input, fromUnit, result, toUnit, category);
        }
    }

    // Special temperature conversion
    function convertTemperature(value, fromUnit, toUnit) {
        // Convert to Celsius first
        let celsius;
        switch (fromUnit) {
            case 'celsius':
                celsius = value;
                break;
            case 'fahrenheit':
                celsius = (value - 32) * 5/9;
                break;
            case 'kelvin':
                celsius = value - 273.15;
                break;
        }
        
        // Convert from Celsius to target unit
        switch (toUnit) {
            case 'celsius':
                return celsius;
            case 'fahrenheit':
                return celsius * 9/5 + 32;
            case 'kelvin':
                return celsius + 273.15;
        }
    }

    // Swap the from and to units
    function swapUnits() {
        const tempUnit = fromUnitSelector.value;
        fromUnitSelector.value = toUnitSelector.value;
        toUnitSelector.value = tempUnit;
        convert();
    }

    // Add conversion to history
    function addToHistory(input, fromUnit, output, toUnit, category) {
        const fromLabel = unitLabels[category][fromUnit].split(' ')[0];
        const toLabel = unitLabels[category][toUnit].split(' ')[0];
        
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        historyItem.innerHTML = `
            <span>${input} ${fromLabel} = ${output} ${toLabel}</span>
            <span>✓</span>
        `;
        
        // Add to top of history
        historyList.insertBefore(historyItem, historyList.firstChild);
        
        // Limit history to 10 items
        if (historyList.children.length > 10) {
            historyList.removeChild(historyList.lastChild);
        }
        
        // Add click to reuse conversion
        historyItem.addEventListener('click', function() {
            inputValue.value = input;
            fromUnitSelector.value = fromUnit;
            toUnitSelector.value = toUnit;
            convert();
        });
    }
});