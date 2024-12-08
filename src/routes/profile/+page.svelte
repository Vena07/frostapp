<script>
    const {data} = $props(); // Svelte 5 import data
   
    const user = data.props?.User1; // props - writing select object
    console.log(user)
    async function logout() {
      await fetch('/logout', { method: 'POST' });
      window.location.href = '/login';
    }
    function calculateAge(birthDate) {
    const birth = new Date(birthDate); // Převod data narození na objekt Date
    const today = new Date(); // Dnešní datum
    let age = today.getFullYear() - birth.getFullYear(); // Počítání věku podle let

    // Pokud narozeniny letos ještě neproběhly, odečteme jeden rok
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }

    return age;
    }   

    
    let vek = calculateAge(user.datum_nar);
</script>
   
<div class="dashboard-contener">
    <div class="profile-card">
        <button onclick={logout} class="tlacitko">Logout</button>
        <div>
            <img src="/images/krizek.png" alt="">
            <p>{user.nickname}<br> {vek} Let</p>
        </div>
        <button><img src="/images/setting.png" alt=""></button>
    </div>

    <div class="aktual-card">
        <p class="akt">Aktualne</p>
        <img src="/images/card2.png" alt="">
        <p class="tipy">Tipy, jak se připravit na přijímačky</p>
    </div>

    <div class="cards-container">
        <div class="navod">
            <img src="/images/pana2.png" alt="">
            <p class="navod-text">Navod do života</p>
        </div>
        <div class="poradce">
            <img src="/images/pana3.png" alt="">
            <p class="poradce-text"> <a href="/poradce">Poradce v kapse</a></p>
        </div>
    </div>

    <div>
        <img src="/images/upfotter.png" alt="">
        <div class="footer">
            <p>Foster app <br> TechTower, 301 00 Plzeň <br>
            IČO: xxxxxxxx <br>
            Číslo účtu: xx-xxxxxxxxxx/xxxx <br>
            ID datové schránky: xxxxxx <br>
            Kontakt: <a href="mailto:info@fosterapp.cz">info@fosterapp.cz</a>
            </p>
        </div>
    </div>

</div>

<style lang="scss">
    *{
        font-family: "Outfit";
    }

    .tlacitko{
        font-size: 15px;
        color: white;
        margin: 5px;
    }

    .dashboard-contener{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        gap: 40px;
        padding: 10px 20px 0 20px;
        width: 100%;
        box-sizing: border-box;
        background-image: url("/images/backgroud.png");
    }

    .profile-card{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        height: 150px;
        border-radius: 10px;
        background: linear-gradient(110.37deg, #E44F95 0%, #4C328A 100%);
        padding-top: 15px;
        position: relative;

        div{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        button{
            background: none;
            border: none;
            cursor: pointer;
        }

        p {
            text-align: center;
            color: white;
            font-family: Outfit;
            font-weight: 700;
            font-size: 18px;
            margin: 0;
        }

    }
    .aktual-card{
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;
        width: 100%;
        height: 170px;
        border-radius: 10px;
        background: linear-gradient(110.37deg, #E44F95 0%, #4C328A 100%);
        
        position: relative;

        .akt{
            position:absolute;
            color: white;
            margin: 0;
            top: 5px;
            left: 5px;
            font-family: Outfit;
            font-size: 22px;
            font-weight: 700;
        }
        .tipy{
            margin: 0 8px 8px 0;
            color: white;
            font-family: Outfit;
            font-size: 14px;
            font-weight: 700;

        }
        
    }

    .cards-container {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: 14px;
        margin-top: 30px;
    }

    .navod, .poradce {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
        border-radius: 10px;
        height: 124px;
        width: 100%;
        background: linear-gradient(110.37deg, #E44F95 0%, #4C328A 100%);

        p,a{
            margin: 0 0 6px 0;
            color: white;
            font-weight: 600;
            text-decoration: none;
        }
    }

    .footer {
    background-color: #4C328A;
    color: white;
    padding: 20px;
    text-align: left;
    width: 100%;
    border-top: 6px solid #E44F95;
    box-sizing: border-box;

    img {
        width: 100%;
    }
  }

  .footer p {
    color: white;
    font-family: Outfit;
    font-size: 10px;
    font-weight: 500;
    line-height: 7.56px;
    text-align: left;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
    line-height: 15px;
  }
  .footer a {
    color: white;
    text-decoration: none;
    font-weight: bold;
  }


</style>