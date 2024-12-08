<script>
    

    let poradci = $state([]);


    const loadData = async (table) => {
        try {
        const response = await fetch(`/api/data?table=${table}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Chyba při načítání ${table}:`, await response.text());
            return [];
        }
        } catch (error) {
        console.error(`Chyba při načítání ${table}:`, error);
        return [];
        }
    };

    // Načítání dat pomocí $effect
    $effect(() => {
        loadData('poradce').then((data) => (poradci = data));
        
    });
    
</script>
<div class="container">
    {#each poradci as poradce}
    <div class="card">
        <h2>{poradce.otazka}</h2>
        <p>{poradce.odpoved}</p>
        <div class="card-label">
            <div>
                {poradce.typ}
            </div>
            <div>
                {poradce.tema}
            </div>
        </div>
    </div>
{/each}

</div>


<style lang="scss">
    .container{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        //flex-direction: column;
        flex-wrap: wrap;
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
    }

    .card{
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        //;gap: 10px;
        max-width: 500px;
        max-height: 500px;
        height: 400px;
        margin: auto;
        background-color: white;
        border-radius: 10px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        padding: 10px;
        box-sizing: border-box;
        

        .card-label{
            display: flex;
            gap: 10px;
            justify-content: space-between;
            width: 100%;
            box-sizing: border-box;
            padding: 15px;

            div{
                padding: 10px;
                border-radius: 10px;
                box-sizing: border-box;

                &:nth-child(1){
                    background-color: green;
                    color: white;
                }
                &:nth-child(2){
                    background-color: purple;
                    color: white;
                }
            }
        }
    }
</style>