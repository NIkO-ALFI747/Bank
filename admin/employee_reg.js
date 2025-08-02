$("#reg_employee").on("click", function( event ) {
    event.preventDefault();
    form_employee();
});

$("#main_content").on("submit", "#employee", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/employee_reg.php',
        data: {
        employee_type: $("#employee_type").val(),
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
        ID_office: $("#ID_office").val(),
        login: $("#login").val(),
        password: $("#password").val()
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

function form_employee(){
    $('#main_content').empty();
    var addDays = 1;
    var now=new Date();
    now.setMonth(now.getMonth()+ addDays);
    $('#main_content').append(`
        <h1 class="title">Форма регистрации</h1>
        
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Регистрация сотрудника</h3>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="employee" class="form_em" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Тип сотрудника</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Тип сотрудника</label>
                                        <input id="employee_type" type="text" placeholder="Отдел валютного управления">
                                    </div>
                                </div></br>
                            </div>
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
                                <span class="title">Данные об офисе, где будет работать сотрудник</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Офис</label>
                                        <select id="ID_office">
                                            <option disabled selected>Выберите офис</option>
                                            <option value="1">#1 Москва, Батайская, 34</option>
                                            <option value="2">#2 Москва, Старо-Нагорная, 89</option>
                                        </select>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Учетные данные</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Логин</label>
                                        <input id="login" type="text" placeholder="employee123" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Пароль</label>
                                        <input id="password" type="password" placeholder="123abc123" required>
                                    </div>
                                    <div class="input-field"></div>
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