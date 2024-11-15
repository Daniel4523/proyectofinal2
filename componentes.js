Vue.component('gestion-productos', {
  template: `
    <div>
      <button 
        class="btn btn-success" 
        data-toggle="modal" 
        data-target="#gestionModal" 
        v-if="userRole === 1">
        Gestión de Productos
      </button>

      <div class="modal fade" id="gestionModal" tabindex="-1" role="dialog" aria-labelledby="gestionModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="gestionModalLabel">Gestión de Productos</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="addProduct">
                <div class="form-group">
                  <label for="name">Nombre</label>
                  <input type="text" id="name" v-model="product.name" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="description">Descripción</label>
                  <textarea id="description" v-model="product.description" class="form-control" required></textarea>
                </div>
                <div class="form-group">
                  <label for="price">Precio</label>
                  <input type="number" id="price" v-model="product.price" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="image">Imagen (URL)</label>
                  <input type="text" id="image" v-model="product.image" class="form-control" required>
                </div>
                <div class="form-group">
                  <label for="category">Categoría</label>
                  <input type="text" id="category" v-model="product.category" class="form-control" required>
                </div>
                <button type="submit" class="btn btn-primary">Agregar Producto</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      product: {
        id: null,
        name: '',
        description: '',
        price: 0,
        image: '',
        category: ''
      },
      userRole: parseInt(localStorage.getItem('userRole')) || null
    };
  },
  methods: {
    async addProduct() {
      try {
        
        const id = Date.now(); 
        const newProduct = { ...this.product, id };

        const response = await fetch('http://127.0.0.1:5000/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newProduct)
        });

        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          this.resetForm();
          $('#gestionModal').modal('hide');
        } else {
          alert(data.error || 'Error al agregar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
      }
    },
    resetForm() {
      this.product = {
        id: null,
        name: '',
        description: '',
        price: 0,
        image: '',
        category: ''
      };
    }
  }
});

Vue.component('nav-bar', {
  template: `
    <nav class="navbar navbar-expand-lg">
      <a class="navbar-brand" href="index.html">Tienda Green Piece</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"><a class="nav-link" href="index.html">Inicio</a></li>
          <li class="nav-item"><a class="nav-link" href="carrito.html">Carrito</a></li>
          <li class="nav-item"><a class="nav-link" href="registrarse.html">Registrarse</a></li>
          <li class="nav-item"><a class="nav-link" href="comentarios.html">Comentarios</a></li>
          <template v-if="userRole === 1">
            <li class="nav-item"><a class="nav-link" href="gestion.html">Gestión Interna</a></li>
          </template>
          <template v-if="userRole === 2">
       
            <li class="nav-item"><a class="nav-link" href="perfil.html">gestion de perfil</a></li>
          </template>
        </ul>
      </div>

      <button 
        class="btn btn-outline-light ml-auto" 
        data-toggle="modal" 
        data-target="#loginModal" 
        v-if="userRole === null">
        <img src="img/login-icon.png" alt="" style="width: 20px; height: 20px; margin-right: 5px;"> 
        Iniciar Sesión
      </button>

      <button 
        class="btn btn-outline-light ml-auto" 
        @click="logout" 
        v-if="userRole !== null">
        Cerrar Sesión
      </button>

      <!-- Modal de Iniciar Sesión -->
      <div class="modal fade" id="loginModal" tabindex="-1" role="dialog" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="loginModalLabel">Iniciar Sesión</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="login">
                <div class="form-group">
                  <label for="username">Nombre de Usuario</label>
                  <input type="text" class="form-control" id="username" v-model="username" required>
                </div>
                <div class="form-group">
                  <label for="password">Contraseña</label>
                  <input type="password" class="form-control" id="password" v-model="password" required>
                </div>
                <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal de Mensajes -->
      <div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="messageModalLabel">Mensaje</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>{{ message }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  data() {
    return {
      username: '',
      password: '',
      message: '',
      userRole: null,  
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
  },
  created() {
    
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      this.userRole = parseInt(storedRole);
    }
  },
  methods: {
    async login() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password
          })
        });

        const data = await response.json();
        if (response.ok) {
          this.message = `Bienvenido ${data.user.email}`;
          this.userRole = data.user.ID; 
          localStorage.setItem('userRole', this.userRole); 
          $('#loginModal').modal('hide'); 
        } else {
          this.message = data.message;
        }
        
        $('#messageModal').modal('show'); 
      } catch (error) {
        this.message = 'Error en la conexión al servidor';
        $('#messageModal').modal('show');
      }
    },
    logout() {
      this.userRole = null; 
      localStorage.removeItem('userRole'); 
      this.message = 'Sesión cerrada correctamente';
      $('#messageModal').modal('show'); 
    },
    async changePassword() {
      if (this.newPassword !== this.confirmPassword) {
        this.message = 'Las contraseñas no coinciden';
        $('#messageModal').modal('show');
        return;
      }

      try {
        const response = await fetch('http://127.0.0.1:5000/api/change-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: this.oldPassword,
            newPassword: this.newPassword
          })
        });

        const data = await response.json();
        if (response.ok) {
          this.message = 'Contraseña cambiada con éxito';
        } else {
          this.message = data.message;
        }

        $('#messageModal').modal('show'); 
      } catch (error) {
        this.message = 'Error al cambiar la contraseña';
        $('#messageModal').modal('show');
      }
    }
  }
});

Vue.component('footer-bar', {
  template: `
    <footer class=" text-white text-center py-3">
      <p>&copy; 2024 Tienda Electrodomésticos y Juguetería</p>
    </footer>
  `
});

new Vue({
  el: '#app',
  data() {
    return {
      products: [],
      cart: [],
      searchQuery: '',
       selectedCategory: ''
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCart();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/products');
        this.products = await response.json();
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    },
    async fetchCart() {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/cart');
        this.cart = await response.json();
      } catch (error) {
        console.error('Error al obtener el carrito:', error);
      }
    },
    async addToCart(product) {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id: product.id })
        });
        const data = await response.json();
        if (response.ok) {
          this.cart.push(product);  
          alert(data.message);
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Error al agregar al carrito:', error);
      }
    },
    async removeFromCart(productId) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/api/cart/${productId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (response.ok) {
          this.cart = this.cart.filter(item => item.id !== productId);
          alert(data.message);
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error('Error al eliminar del carrito:', error);
      }
    }
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product => {
        const matchesName = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.selectedCategory ? product.category === this.selectedCategory : true;
        return matchesName && matchesCategory;
      });
    },
    totalPrice() {
      return this.cart.reduce((total, product) => total + product.price, 0);
    }
  }
});

