const textGen = function (response) {
    const CityName = "город: "+response.name+", страна: "+response.sys.country+"\n"
    const Weather = "погода: " +
        "\nНебо: "+response.weather[0].main+", закрыто облаками на "+response.clouds.all+"%"+
        "\nТемпература: "+response.main.temp+"K"+
        "\nОщущаеться как: "+response.main.feels_like+"K"+
        "\nДавление: "+response.main.pressure+"hPa"+
        "\nВлажность: "+response.main.humidity+"%"+
        "\nСкорость ветра: "+response.wind.speed+"м/c"+
        "\nВидимость: "+response.visibility+"м";

    return CityName+Weather
}

module.exports = textGen;