$("#reg_customer").on("click", function( event ) {
    event.preventDefault();
    form_customer();
});


$("#main_content").on("submit", "#customer", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_reg.php',
        data: {
        name: $("#name").val(),
        surname: $("#surname").val(),
        patronymic: $("#patronymic").val(),
        gender: $("#gender").val(),
        date_of_birth: $("#date_of_birth").val(),
        passport_series: $("#passport_series").val(),
        passport_number: $("#passport_number").val(),
        date_of_issue: $("#date_of_issue").val(),
        phone_number: $("#phone_number").val(),
        email: $("#email").val(),
        country: $("#country").val(),
        city: $("#city").val(),
        street: $("#street").val(),
        house: $("#house").val(),
        flat: $("#flat").val(),
        work_experience: $("#work_experience").val(),
        income: $("#income").val(),
        abbreviation_currency: $("#abbreviation_currency").val(),
        login: $("#login").val(),
        password: $("#password").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        form_customer_card(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});


$("#main_content").on("submit", "#customer_card", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_debit_card_reg.php',
        data: {
        ID_customer: $("#ID_customer").val(),
        ID_debit_card: $("#ID_debit_card").val(),
        Number: $("#Number").val(),
        CVV: $("#CVV").val(),
        PIN: $("#PIN").val(),
        Account_number_rub: $("#Account_number_rub").val(),
        Account_number_usd: $("#Account_number_usd").val(),
        Account_number_eur: $("#Account_number_eur").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#message').empty();
        $('#message').append('<div style="color:#ffe41c;">'+data+'</div>');
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});




function form_customer(){
    $('#main_content').empty();
    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <h1 class="title">Форма регистрации</h1>
        
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Регистрация клиента</h3>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="customer" class="form_cs" action="#">
                        <div class="form first">
                            <div class="details personal">
                                <span class="title">Личные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Имя</label>
                                        <input id="name" type="text" placeholder="Александр" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Фамилия</label>
                                        <input id="surname" type="text" placeholder="Александров" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Отчество</label>
                                        <input id="patronymic" type="text" placeholder="Александрович" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Пол</label>
                                        <select id="gender" required>
                                            <option disabled selected>Выберите пол</option>
                                            <option>М</option>
                                            <option>Ж</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Дата рождения</label>
                                        <input id="date_of_birth" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Серия паспорта</label>
                                        <input id="passport_series" type="text" placeholder="4123" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер паспорта</label>
                                        <input id="passport_number" type="text" placeholder="123456" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Дата выдачи паспорта</label>
                                        <input id="date_of_issue" type="date" min="1900-01-01" max="`+ now.getFullYear() +`-0`+ now.getMonth() +`-`+ now.getDate() +`" required>
                                    </div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер телефона</label>
                                        <input id="phone_number" type="text" placeholder="7(310)566-68-49" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Email</label>
                                        <input id="email" type="email" placeholder="test@gmail.com" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные адреса</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Страна</label>
                                        <input id="country" type="text" placeholder="США" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Город</label>
                                        <input id="city" type="text" placeholder="North Carolina" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Улица</label>
                                        <input id="street" type="text" placeholder="Powell Hills" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Дом</label>
                                        <input id="house" type="text" placeholder="17" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Квартира</label>
                                        <input id="flat" type="text" placeholder="57" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные о карьере</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Опыт работы</label>
                                        <input id="work_experience" type="number" placeholder="Количество лет">
                                    </div>
                                    <div class="input-field">
                                        <label>Размер дохода</label>
                                        <input id="income" type="number" placeholder="50000">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип валюты</label>
                                        <select id="abbreviation_currency">
                                            <option disabled selected>Выберите валюту</option>
                                            <option>RUB</option>
                                            <option>USD</option>
                                            <option>EUR</option>
                                        </select>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Учетные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Логин</label>
                                        <input id="login" type="text" placeholder="customer123" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Пароль</label>
                                        <input id="password" type="password" placeholder="123abc123" required>
                                    </div>
                                    <div class="input-field"></div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Далее</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function form_customer_card(ID_customer){
    $('#main_content').empty();
    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <h1 class="title">Форма регистрации</h1>
        
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Оформление дебетовой карты клиента</h3>
                </div>
                <div class="conteiner-form">
                    <div class="find_card">
                    <form id="customer_card" class="form_card" action="#">
                        <div class="form first">
                            <input id="ID_debit_card" type="hidden" value="3">
                            <input id="ID_customer" type="hidden" value="`+ID_customer+`">
                            <div class="details personal">
                                <span class="title">Данные карты</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер карты</label>
                                        <input id="Number" type="text" placeholder="5000001234567905" required>
                                    </div>
                                    <div class="input-field">
                                        <label>CVV код</label>
                                        <input id="CVV" type="text" placeholder="017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>PIN код</label>
                                        <input id="PIN" type="text" placeholder="0017" required>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные счёта</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер счета в валюте RUB</label>
                                        <input id="Account_number_rub" type="text" placeholder="0004016" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте USD</label>
                                        <input id="Account_number_usd" type="text" placeholder="0004017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте EUR</label>
                                        <input id="Account_number_eur" type="text" placeholder="0004018" required>
                                    </div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Зарегистрировать</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}