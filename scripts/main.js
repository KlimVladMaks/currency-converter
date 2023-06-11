// Массив с основными валютами, для которых нужно отобразить котировки в карточках
let mainCurrency = ["USD", "EUR", "GBP", "JPY", "CNY"];

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

    // Перебираем все основные валюты
    for (let currency of mainCurrency) {

        // Получаем элемент, хранящий значение итерируемой валюты
        const currencyItemValue = document.querySelector(`[data-value="${currency}"]`);

        // Устанавливаем значение для курса валюты
        currencyItemValue.textContent = currencyData.Valute[currency].Value.toFixed(2);

        // Из-за некорректности API делим курс йены на 100 для приведения к корректному значению
        if (currency === "JPY") {
            currencyItemValue.textContent = (currencyData.Valute[currency].Value / 100).toFixed(2);
        }

        // Задаём цвет значения котировок валюты в зависимости от их роста или падения
        if (currencyData.Valute[currency].Value > currencyData.Valute[currency].Previous) {
            currencyItemValue.classList.remove("bottom");
            currencyItemValue.classList.add("top");
        } else if (currencyData.Valute[currency].Value < currencyData.Valute[currency].Previous) {
            currencyItemValue.classList.remove("top");
            currencyItemValue.classList.add("bottom");
        }
    }
}

// При вводе значения в поле ввода вызываем функцию
input.oninput = async function() {

    // Получаем данные о курсах валют
    const currencyData = await getCurrencyRates();
}

// Обновляем курсы основных валют в карточках
updateCurrencyRates();
