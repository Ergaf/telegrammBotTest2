// оставил клавиатуру зачем-то) была в примере)
const keyboard = require('./keyboards/keyBoardMain');
const textGen = require('./textGenFromResponse');
const fetch = require('./fetch');

// берем бота
const TelegramBot = require('node-telegram-bot-api');
// имя пользователя бота: @TestWeatherrBot

// токены и адрес разбитый на 2 части, чтоб было удобно вставлять нужный город
const tokenTelegrammBot = '1876257632:AAEnfMC8_hF2KSUTLu7bUPvx4yxB7khUM9o';
const urlWeather = "http://api.openweathermap.org/data/2.5/weather?q=";
const tokenWeather = "&appid=97238627e9497618ae7edec3e92e2fa4"

// включаем самого бота в режиме лонгПоллинг
const bot = new TelegramBot(tokenTelegrammBot, {polling: true});

// обработчик события присылания нам любого сообщения(хз почему сообщения в чатах без -
// - "/" не обрабатываються, это не я, это на стороне телеги)
// было бы логично отправить: "введите город" и ожидать его в ответе но не могу, пришлось бы отправлять "/cityName")
bot.on('message', (msg) => {
    const chatId = msg.chat.id; // id диалога куда отвечать
    const messageId = msg.message_id; // id сообщения что бы отвечать конкретно юзеру
    const userId = msg.from.id; // id юзера, на всякий)
    const messageText = msg.text; // текст сообщения для анализа

    // обрежем приходящее сообщение до 5 символа, как раз столько сколько в обоих наших командах
    const command = messageText.substr(0, 5)
    // отсеем только то что идет через пробел после команды, вероятно это название города
    const city = messageText.substr(6)

    // раз у нас 2 команды по 5 символов - почему бы и нет, проверяем
    switch(command) {
        case '/help':
            bot.sendMessage(chatId, 'Этот бот умеет просто показывать текущую погоду по названию города.\nЧего изволите?', {
                reply_to_message_id: messageId,
                reply_markup: {
                    inline_keyboard: keyboard
                }
            });
            break

        case '/getW':
            // узнаем писал ли пользователь что-то после команды и пробела
            if(city.length>1){
                const fetchUrl = urlWeather+city+tokenWeather
                // моя странная конструкция для отправки запроса)
                async function getWeather() {
                    const response = await fetch(fetchUrl);
                    if(response.name){
                        // если название города пришло - значит такой есть, отправляем ответ
                        await bot.sendMessage(chatId, textGen(response), {
                            reply_to_message_id: messageId,
                        });
                    } else {
                        // если вдруг нет - не беда, отправляем сообщение
                        bot.sendMessage(chatId, 'Такого города нет в базе, попробуйте еще раз!', {
                            reply_to_message_id: messageId,
                        });
                    }
                }
                // вызываем эту странность
                getWeather();
                break
            } else {
                // раз сюда пришло - вероятно была вызвана команда без указания города
                bot.sendMessage(chatId, 'Введите "/getW" и название города на английском через пробел, например:\n"/getW kiev"', {
                    reply_to_message_id: messageId,
                });
                break
            }

        default:
            console.log(messageText);
            break
    }
});

// обработчик событий нажатий на клавиатуру
bot.on('callback_query', (query) => {
    const chatId = query.message.chat.id;
    // const messageId = query.message.message_id;

    if (query.data === 'weather') { // если кот
        bot.sendMessage(chatId, 'Введите "/getW" и название города на английском через пробел, например:\n"/getW kiev"', {
            // reply_to_message_id: messageId,
        });
    }

    if (query.data === 'test') { // если пёс
        bot.sendMessage(chatId, 'тестировщики заняты))', {
            // reply_to_message_id: messageId,
        });
    }
});