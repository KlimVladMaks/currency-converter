// Массив с основными валютами, для которых нужно отобразить котировки в карточках
const mainCurrency = ["USD", "EUR", "GBP", "JPY", "CNY"];

// Получаем поля ввода и вывода количества отдаваемой валюты
const input = document.querySelector("#input");
const output = document.querySelector("#output");

// Получаем раскрывающиеся списки для выбора отдаваемой и получаемой валюты
const inputSelect = document.querySelector("#give-currency");
const outputSelect = document.querySelector("#get-currency");

/*
Функция для получения данных о котировках валюты.

@return {Object} Объект, хранящий курсы валют в формате 
object[код валюты][текущее/предыдущее значение] = значение котировок.
*/
async function getCurrencyRates() {

    // Создаём объект для хранения курсов валют
    const currencyRates = {};

    // Отправляем запрос и получаем ответ с курсами валют
    const response = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");

    // Преобразуем ответ с курсами валют в JSON-формат
    const json = await response.json();

    // Перебираем все коды валют
    for (let currencyKey in json.Valute) {

        // Сохраняем в объект значение текущего и предыдущего курса итерируемой валюты
        currencyRates[currencyKey] = {};
        currencyRates[currencyKey].Previous = json.Valute[currencyKey].Previous;
        currencyRates[currencyKey].Value = json.Valute[currencyKey].Value;
    }

    // Из-за некорректности API делим курс йены на 100 для приведения к корректному значению
    currencyRates.JPY.Value = currencyRates.JPY.Value / 100;
    currencyRates.JPY.Previous = currencyRates.JPY.Previous / 100;

    // Также помещаем в объект котировки рубля (один рубль всегда равен одному рублю)
    currencyRates.RUB = {};
    currencyRates.RUB.Value = 1;
    currencyRates.RUB.Previous = 1;

    // Возвращаем объект с курсами валют
    return currencyRates;
}

/*
Функция для обновления курсов основных валют в карточках.
*/
async function updateCurrencyRates() {

    // Получаем данные о курсах валют
    const currencyRates = await getCurrencyRates();

    // Перебираем все основные валюты
    for (let currencyKey of mainCurrency) {

        // Получаем элемент, хранящий значение итерируемой валюты
        const currencyItemValue = document.querySelector(`[data-value="${currencyKey}"]`);

        // Устанавливаем значение для курса валюты
        currencyItemValue.textContent = currencyRates[currencyKey].Value.toFixed(2);

        // Задаём цвет значения котировок валюты в зависимости от их роста или падения
        if (currencyRates[currencyKey].Value > currencyRates[currencyKey].Previous) {
            currencyItemValue.classList.remove("bottom");
            currencyItemValue.classList.add("top");
        } else if (currencyRates[currencyKey].Value < currencyRates[currencyKey].Previous) {
            currencyItemValue.classList.remove("top");
            currencyItemValue.classList.add("bottom");
        }
    }
}

/* 
Функция, рассчитывающая и устанавливающая количество получаемой валюты.
*/
async function setGetCurrency() {

    // Получаем данные о курсах валют
    const currencyRates = await getCurrencyRates();

    // Получаем коды отдаваемой и получаемой валют
    const giveCurrencyKey = inputSelect.value;
    const getCurrencyKey = outputSelect.value;

    // Получаем количество отдаваемой валюты
    let giveCurrencyCount = input.value;

    // Если количество отдаваемой валюты не задано, устанавливаем его равным нулю
    if (giveCurrencyCount === "") {
        input.value = 0;
        giveCurrencyCount = 0;
    }

    // Рассчитываем и задаём количество получаемой валюты
    output.value = 
        ((currencyRates[giveCurrencyKey].Value * giveCurrencyCount) / currencyRates[getCurrencyKey].Value).toFixed(2);
}

// Обновляем курсы основных валют в карточках
updateCurrencyRates();

// Вызываем функцию setGetCurrency() для установки значений по умолчанию в поля ввода
setGetCurrency();

// Задаём слушателей для поля ввода количества отдаваемой валюты, а также двух открывающихся списков
// (При действие с любым из этих объектов рассчитывается и устанавливается количество получаемой валюты)
input.oninput = setGetCurrency;
inputSelect.oninput = setGetCurrency;
outputSelect.oninput = setGetCurrency;
