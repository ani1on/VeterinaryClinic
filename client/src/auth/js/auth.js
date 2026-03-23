const { createApp, ref, reactive, onMounted } = Vue

createApp({
    setup(){

        const isLoggedIn = ref(false)
        const userName = ref('')

        const isLogin = ref(true)

        const loginForm = reactive({
            email:'',
            password:''
        })

        const registerForm = reactive({
            name:'',
            email:'',
            password:'',
            confirmPassword:''
        })

        const registerError = ref('')

        //TODO: сделать работу с localStorage и добавить ее в onmouted

        const handleLogin = async () => {
            try{
                //TODO: в fetch отправляем ссылку на ручку
                const response = await fetch('',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify(loginForm)
                })

                if(!response.ok) {
                    throw new Error('Ошибка входа')
                }

                const data = await response.json()

                //TODO: сохранение пользовательских данных в localStorage

                isLoggedIn.value = true
                userName.value = loginForm.userName

            } catch (error){
                //TODO: возможно надо будет переделать(сообщение об ошибке авторизации)
                
                alert(error.massage)
            }
        }

        const handleRegister = async () => {
            //TODO: так же добавить ссылку на ручку
            try{
                const response = await fetch('',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                        username: registerForm.name,
                        email: registerForm.email,
                        password: registerForm.password
                    })
                })

                if(!response.ok){
                    const err = await response.json()
                    throw new Error(err.detail)
                }

                const data = await response.json()

                //todo: передача данных о пользователе на localStorage

                isLoggedIn.value = true
                userName.value = data.name
            } catch(error){
                registerError.value = error.massage
            }
        }

        const gotoTape = () => {
            //todo: да, и тут передача данных об юзере на localStorage(((
        }

        onMounted(()=>{
            //todo: добавить работу с локалсторэджом(эта функции делает проверку после полной загрузки вью)
        })

        return {
            isLoggedIn,
            userName,
            isLogin,
            loginForm,
            registerError,
            registerForm,
            handleLogin,
            handleRegister,
            gotoTape
        }

    }
}).mount('#app')