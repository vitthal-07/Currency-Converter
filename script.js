const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdowns = document.querySelectorAll("select");
const input = document.querySelector("#inputAmount");
const output = document.querySelector("#outputAmount");
const fromCurr = document.querySelector(".conversion-from select");
const toCurr = document.querySelector(".conversion-to select");

const updateFlag = (target) => {
    const currCode = target.value;
    const countryCode = countryList[currCode];
    const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
    target.parentElement.parentElement.querySelector("img").src = newSrc;
};

const fetchData = async (from, to) => {
    const URL = `${BASE_URL}/${from.toLowerCase()}/${to.toLowerCase()}.json`;
    const response = await fetch(URL);
    return response.json();
};

const updateValue = async (leftToRight) => {
    const amt = leftToRight ? input.value : output.value;
    if (amt === "" || amt < 1) return;

    const fromCurrency = fromCurr.value.toLowerCase();
    const toCurrency = toCurr.value.toLowerCase();

    const data = await fetchData(leftToRight ? fromCurrency : toCurrency, leftToRight ? toCurrency : fromCurrency);

    const rate = data[leftToRight ? toCurrency:fromCurrency];
    let finalAmt = amt * rate;
    finalAmt = Math.ceil(finalAmt * 1000) / 1000;

    leftToRight ? (output.value = finalAmt) : (input.value = finalAmt);
};

for (let select of dropdowns) {
    for (let currCode in countryList) {
        const newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;
        if (select.name === "fromCurrency" && currCode === "USD") newOption.selected = "selected";
        else if (select.name === "toCurrency" && currCode === "INR") newOption.selected = "selected";
        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

input.addEventListener("change", () => {
    updateValue(true);
});

output.addEventListener("change", () => {
    updateValue(false);
});

window.addEventListener("load", () => {
    updateValue(true);
});
