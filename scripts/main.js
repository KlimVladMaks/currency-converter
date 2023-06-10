// Получаем элементы со значениями основных валют
valueUSD = document.querySelector("[data-value='USD']");
valueEUR = document.querySelector("[data-value='EUR']");
valueGBP = document.querySelector("[data-value='GBP']");
valueJPY = document.querySelector("[data-value='JPY']");
valueCNY = document.querySelector("[data-value='CNY']");

// Получаем поле ввода количества отдаваемой валюты
input = document.querySelector("#input");

/*
Функция для получения данных о котировках валюты.

@return {JSON-объект} JSON-объект с курсами валют.
*/
async function getCurrencyRates() {

    // Отправляем запрос и получаем ответ с курсами валют
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");

    // Преобразуем ответ с курсами валют в JSON-формат
    const currencyData = await response.json();

    // Возвращаем полученные данные о курсах валют
    return await currencyData;
}

/*
Функция для обновления курсов основных валют в карточках.
*/
async function updateCurrencyRates() {

    // Получаем данные о курсах валют
    const currencyData = await getCurrencyRates();

    // Устанавливаем значения для основных курсов валют
    // (Из-за некорректности API делим курс йены на 100 для приведения к корректному значению)
    valueUSD.textContent = currencyData.Valute.USD.Value.toFixed(2);
    valueEUR.textContent = currencyData.Valute.EUR.Value.toFixed(2);
    valueGBP.textContent = currencyData.Valute.GBP.Value.toFixed(2);
    valueJPY.textContent = (currencyData.Valute.JPY.Value / 100).toFixed(2);
    valueCNY.textContent = currencyData.Valute.CNY.Value.toFixed(2);
}

// При вводе значения в поле ввода вызываем функцию
input.oninput = async function() {

    // Получаем данные о курсах валют
    const currencyData = await getCurrencyRates();
}

// Обновляем курсы основных валют в карточках
updateCurrencyRates();
