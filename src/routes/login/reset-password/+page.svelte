<div class="login">
    <h1>Zapomenuté heslo</h1>
    <h2>Zadejte svůj e-mail a my vám pošleme odkaz, abyste se mohli dostat zpět ke svému účtu.</h2>
    <label class="email">
        E-mail
        <input type="email">
    </label>
    <button type="submit"><strong>Změnit heslo</strong></button>
    <div>
        <a href="/register">Nová registrace</a>
    </div>
</div>
   <img src="/images/bottom.png" alt="Obrázek" />
<style lang="scss">
    *{
        font-family: "Outfit";
    }

    .login{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 600px;
        width: 100%;
        padding: 30px;
        box-sizing: border-box;
        gap: 14px;
        margin: auto;

        button{
            width: 100%;
            height: 50px;
            border-radius: 10px;
            background-color: #67378C;
            color: white;
            border: none;
            cursor: pointer;
        }

        label{
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 4px;
            font-size: 14px;
            font-weight: 500;

            input{
                height: 50px;
                border-radius: 10px;
                padding: 0 10px;
                border: 1.5px solid black;
            }
        }

        div{
            display: flex;
            justify-content: space-between;
            width: 100%;

            a{
                text-decoration: none;
                color: black;
                font-weight: 500;
                transition: ease .3s;

                &:hover{
                    color: rgb(115, 0, 128);
                }
            }
        }
    }

    img{
        width: 100%;
    }
</style>