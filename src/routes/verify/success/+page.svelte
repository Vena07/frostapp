

<svelte:head>
  <title>Verification Successful</title>
</svelte:head>

<div class="verify-container">
  <div class="verify-box">
    <h1>Email Verified Successfully!</h1>
    <p>Your email has been successfully verified. You can now log in.</p>
    <a href="/login" >Back to login</a>
  </div>
</div>

<style>
  .verify-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    padding: 10px;
  }
  
  .verify-box {
    background-color: rgba(0, 0, 0, 0.35);
    padding: 40px;
    border-radius: 10px;
    box-shadow: rgba(17, 12, 46, 0.15) 0px 48px 100px 0px;
    text-align: center;
    background: linear-gradient(90deg, #E44F95 0%, #4C328A 100%);

  }
  
  h1 {
    color: white;
    margin-bottom: 20px;
  }
  
  p {
    margin-bottom: 30px;
    font-size: 18px;
    color: white;
  }
  
  a{
    color: white;
  }  
</style>