const wrapper = document.querySelector(".wrapper"),
  inputPart = wrapper.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector("input"),
  locationBtn = inputPart.querySelector("button"),
  wIcon = wrapper.querySelector(".weather-part img"),
  arrowBack = wrapper.querySelector("header i")

let api

inputField.addEventListener("keyup", (e) => {
  if (e.key === "Enter" && inputField.value !== "") {
    requestApi(inputField.value)
  }
})

locationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSucces, onError)
  } else {
    alert("Seu navegador não suporta localização automática")
  }
})

function onSucces(position) {
  const { latitude, longitude } = position.coords
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=1227d98858d8ff7ceaae90f974917dd3`
  fetchData()
}

function onError() {
  infoTxt.innerHTML = "Geolocalização negada pelo usuário"
  infoTxt.classList.add("error")
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=1227d98858d8ff7ceaae90f974917dd3`
  fetchData()
}

function fetchData() {
  infoTxt.innerHTML = "Buscando detalhes do clima..."
  infoTxt.classList.add("pending")

  fetch(api).then(response => response.json()).then(result => weatherDetails(result))
}

function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.classList.replace("pending", "error")
    infoTxt.innerHTML = `${inputField.value} não é uma cidade válida`
  } else {
    const city = info.name
    const country = info.sys.country
    let { description, id } = info.weather[0]
    const { feels_like, humidity, temp } = info.main

    if (id == 800) {
      wIcon.src = "assets/clear.svg"
      description = "Limpo"
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "assets/storm.svg"
      description = "Tempestade"
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "assets/snow.svg"
      description = "Neve"
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "assets/haze.svg"
      description = "Neblina"
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "assets/cloud.svg"
      description = "Nublado"
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "assets/rain.svg"
      description = "Chuva"
    }

    wrapper.querySelector(".temp .numb").innerText = Math.floor(temp)
    wrapper.querySelector(".weather").innerText = description
    wrapper.querySelector(".location span").innerText = `${city}, ${country}`
    wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like)
    wrapper.querySelector(".humidity span").innerText = `${humidity}%`

    inputField.value = ""
    infoTxt.classList.remove("pending", "error")
    wrapper.classList.add("active")
  }
}

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active")
})