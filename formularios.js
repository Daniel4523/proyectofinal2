
  
Vue.component('form-registrarse', {
  template: `
    <form @submit.prevent="submitForm" class="w-100">
      <div class="form-group">
        <label for="email">Correo:</label>
        <input type="email" v-model="email" id="email" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="confirmEmail">Confirmar Correo:</label>
        <input type="email" v-model="confirmEmail" id="confirmEmail" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input type="password" v-model="password" id="password" class="form-control" required>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña:</label>
        <input type="password" v-model="confirmPassword" id="confirmPassword" class="form-control" required>
      </div>
      <button type="submit" class="btn btn-primary">Registrarse</button>
      <p v-if="message" class="mt-3" :class="{'text-success': message.includes('exitoso'), 'text-danger': !message.includes('exitoso')}">{{ message }}</p>
    </form>
  `,
  data() {
    return {
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      message: ''
    };
  },
  methods: {
    async submitForm() {
      if (this.email === this.confirmEmail && this.password === this.confirmPassword) {
        try {
          const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: this.email,
              password: this.password
            })
          });

          const data = await response.json();
          if (data.message) {
            this.message = 'Registro exitoso para ' + this.email;
          } else {
            this.message = 'Error al registrar usuario';
          }
        } catch (error) {
          this.message = 'Error de conexión con el servidor';
        }
      } else {
        this.message = 'Los correos o las contraseñas no coinciden';
      }
    }
  }
});

  
  Vue.component('form-comentarios', {
    template: `
      <div class="w-100">
        <form @submit.prevent="submitComment" class="mb-4">
          <div class="form-group">
            <label for="comment">Comentario:</label>
            <input type="text" v-model="comment" id="comment" class="form-control" required>
          </div>
          <button type="submit" class="btn btn-primary">Agregar Comentario</button>
        </form>
        <ul class="list-group">
          <li class="list-group-item" v-for="(com, index) in comments" :key="index">{{ com }}</li>
        </ul>
      </div>
    `,
    data() {
      return {
        comment: '',
        comments: []
      };
    },
    methods: {
      submitComment() {
        if (this.comment) {
          this.comments.push(this.comment);
          this.comment = '';
        }
      }
    }
  });
  
  new Vue({
    el: '#formularios'
  });
  