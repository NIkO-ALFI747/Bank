<script>
$("#dashboard").on("click", function( event ) {
    event.preventDefault();
    dashboard();
});

$("#dashboard_p").on("click", function( event ) {
    event.preventDefault();
    dashboard();
});

function dashboard(){
    
    $('#main_content').empty();
    $('#main_content').append(`
    <h1 class="title">Панель виджетов</h1>
    <div class="info-data">
        <div class="card">
            <div class="head">
                <div>
                    <div id="count_customers"></div>
                    <p>Количество клиентов</p>
                </div>
                <i class='bx bxs-wallet icon'></i>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="count_employees"></div>
                    <p>Количество сотрудников</p>
                </div>
                <i class='bx bxs-hard-hat icon'></i>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="count_administrators"></div>
                    <p>Количество администраторов</p>
                </div>
                <i class='bx bx-briefcase-alt-2 icon' ></i>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="count_offices"></div>
                    <p>Количество офисов</p>
                </div>
                <i class='bx bxs-buildings icon' ></i>
            </div>
        </div>
    </div>
    <div class="table-data">
        <div class="order">
            <div class="head">
                <h3>Счета клиентов</h3>
            </div>
            <div id="all_customer_accounts"></div>
        </div>
    </div>
    `);
    
    <?php include 'dashboard_link_query.php'?>
    
    var response = <?php echo $_SESSION['all_customer_accounts'] ?>;
  
    $('#all_customer_accounts').empty();
    $('#all_customer_accounts').append(parse_json(response));

    response = <?php echo $_SESSION['count_customers'] ?>;
    $('#count_customers').empty();
    $('#count_customers').append('<h2>'+response+'</h2>');

    response = <?php echo $_SESSION['count_employees'] ?>;
    $('#count_employees').empty();
    $('#count_employees').append('<h2>'+response+'</h2>');

    response = <?php echo $_SESSION['count_administrators'] ?>;
    $('#count_administrators').empty();
    $('#count_administrators').append('<h2>'+response+'</h2>');

    response = <?php echo $_SESSION['count_offices'] ?>;
    $('#count_offices').empty();
    $('#count_offices').append('<h2>'+response+'</h2>');

}
</script>