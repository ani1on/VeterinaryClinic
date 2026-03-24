const { createApp, ref, reactive, onMounted } = Vue

createApp({
    setup(){

        const isLoggedIn = ref(false)
        const userName = ref('')
        const isLogin = ref(true)
        const isLoading = ref(false)
        const loginError = ref('')
        const registerError = ref('')

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

        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:8000/auth/check', {
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.authenticated) {
                        isLoggedIn.value = true;
                        userName.value = data.user.name;
                    }
                }
            } catch (error) {
                console.error('Auth check failed:', error);
            }
        };

        const handleLogin = async () => {
            isLoading.value = true;
            loginError.value = '';
            
            try {
                const response = await fetch('http://localhost:8000/auth/login', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        email: loginForm.email,
                        password: loginForm.password
                    }),
                    credentials: 'include' 
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Ошибка входа');
                }

                const data = await response.json();
                
                isLoggedIn.value = true;
                userName.value = data.user.name; 
                
                loginForm.email = '';
                loginForm.password = '';
                
                gotoTape();
                
            } catch (error) {
                loginError.value = error.message;
                console.error('Login error:', error);
            } finally {
                isLoading.value = false;
            }
        }

        const handleRegister = async () => {
            isLoading.value = true;
            registerError.value = '';
            
            if (registerForm.password !== registerForm.confirmPassword) {
                registerError.value = 'Пароли не совпадают';
                isLoading.value = false;
                return;
            }
            
            try {
                const response = await fetch('http://localhost:8000/auth/register', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        name: registerForm.name,
                        email: registerForm.email,
                        password: registerForm.password
                    }),
                    credentials: 'include' 
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || error.message || 'Ошибка регистрации');
                }

                const data = await response.json();
                
                isLoggedIn.value = true;
                userName.value = data.user.name; 

                registerForm.name = '';
                registerForm.email = '';
                registerForm.password = '';
                registerForm.confirmPassword = '';
                
                gotoTape();
                
            } catch (error) {
                registerError.value = error.message;
                console.error('Register error:', error);
            } finally {
                isLoading.value = false;
            }
        }

        const handleLogout = async () => {
            try {
                const response = await fetch('http://localhost:8000/auth/logout', {
                    method: 'POST',
                    credentials: 'include'
                });
                
                if (response.ok) {
                    isLoggedIn.value = false;
                    userName.value = '';
                  
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        }


        const gotoTape = () => {
          
            console.log('Переход на ленту, пользователь:', userName.value);
            
        }


        const toggleForm = () => {
            isLogin.value = !isLogin.value;

            loginError.value = '';
            registerError.value = '';
        }

  
        onMounted(() => {
            checkAuth();
        })

        return {
            isLoggedIn,
            userName,
            isLogin,
            isLoading,
            loginError,
            registerError,
            loginForm,
            registerForm,
            handleLogin,
            handleRegister,
            handleLogout,
            gotoTape,
            toggleForm
        }

    }
}).mount('#app')