$("#m12").on("click", function( event ) {
    event.preventDefault();
    m12_full();
});

$("#main_content").on("keyup","#cashback_percentage_from", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#cashback_percentage_to", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#maintenance_cost_from", function() {
    get_debit_cards(1);
});
$("#main_content").on("keyup","#maintenance_cost_to", function() {
    get_debit_cards(1);
});
$("#main_content").on("change", "#category_var", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});
$("#main_content").on("change", "#sort_column", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});
$("#main_content").on("change", "#sort_type", function( event ) {
    event.preventDefault();
    get_debit_cards(1);
});


function m12_full(){
    $('#main_content').empty();
    filtr_form();
}

function filtr_form(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/m12_category_var.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_filtr(parse_json_select_2(data)));
        form_sort_column();
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Дебетовые карты</h3>
                    </div>
                    <div id="all_debit_cards"></div>
                </div>
        </div>`);
        get_debit_cards(0);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function get_debit_cards(a){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/get_debit_cards.php',
        data: {
            flag:a,
            cashback_percentage_from:$("#cashback_percentage_from").val(),
            cashback_percentage_to:$("#cashback_percentage_to").val(),
            maintenance_cost_from:$("#maintenance_cost_from").val(),
            maintenance_cost_to:$("#maintenance_cost_to").val(),
            category_var:$("#category_var").val(),
            sort_column:$("#sort_column").val(),
            sort_type:$("#sort_type").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#all_debit_cards').empty();
        $('#all_debit_cards').append(parse_json(data));
        
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}






function form_sort_column(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/sort_column.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#sort_column').append(parse_json_select_3(data));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function form_filtr(select){
    return `
    <h1 class="title">Дебетовые карты</h1>
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Форма фильтрации</h3>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="employee_edit" class="form_filtr" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Фильтр</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Размер кэшбека</label>
                                        <input id="cashback_percentage_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Размер кэшбека</label>
                                        <input id="cashback_percentage_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип категории</label>
                                        <select id="category_var">
                                            <option disabled selected>Выберите тип категории</option>
                                            <option value="ALL">Любой</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div><br/>
                            </div>
                            <div class="details ID">
                                <span class="title">Сортировка</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Сортируемый столбец</label>
                                        <select id="sort_column">
                                            <option disabled selected>Выберите название столбца</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Тип сортировки</label>
                                        <select id="sort_type">
                                            <option disabled selected>Выберите тип сортировки</option>
                                            <option value="DESC">По убыванию</option>
                                            <option value="ASC">По возрастанию</option>
                                        </select>
                                    </div>
                                    <div class="input-field"></div>
                                </div>
                            </div>
                        </form>
                        <div id="message_2" style="text-align:center;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
}





function parse_json_select_2(data){
    var option = '';

    $(data).each(function(index, element) { 
        option += '<option value="'+ element[0] + '">' + element[0] + '</option>';
    });
    
    return option;
}
function parse_json_select_3(data){
    var option = '';

    $(data[0]).each(function(index, element) { 
        option += '<option value="'+ element + '">' + element + '</option>';
    });
    
    return option;
}