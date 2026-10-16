import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ShoppingBag,
  ArrowDown,
  ArrowRight,
  Plus,
  Menu as MenuIcon,
  X,
  Bike,
} from "lucide-react";
import "./App.css";
import Scene3D from "./Scene3D";
gsap.registerPlugin(ScrollTrigger);

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  tag?: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Iced Matcha Latte",
    category: "Matcha",
    price: 450,
    image:
      "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=800&q=85",
    description: "Creamy matcha, chilled milk and a little magic.",
    tag: "BESTSELLER",
  },
  {
    id: 2,
    name: "Caramel Iced Coffee",
    category: "Coffee",
    price: 380,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=85",
    description: "Bold espresso with silky caramel.",
    tag: "FAN FAVOURITE",
  },
  {
    id: 3,
    name: "Chocolate Brownie",
    category: "Dessert",
    price: 320,
    image:
      "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=85",
    description: "Rich, fudgy chocolate in every bite.",
    tag: "MUST TRY",
  },
  {
    id: 4,
    name: "Classic Cappuccino",
    category: "Coffee",
    price: 350,
    image:
      "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=85",
    description: "Fresh espresso topped with silky foam.",
  },
  {
    id: 5,
    name: "Strawberry Matcha",
    category: "Matcha",
    price: 490,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=85",
    description: "Earthy matcha meets sweet strawberry.",
    tag: "NEW",
  },
  {
    id: 6,
    name: "Smash Beef Burger",
    category: "Burgers",
    price: 650,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=85",
    description: "Juicy beef, melted cheese and house sauce.",
  },
  {
    id: 7,
    name: "Classic Pepperoni Pizza",
    category: "Pizza",
    price: 850,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=85",
    description: "Golden crust, rich sauce and cheesy goodness.",
  },
  {
    id: 8,
    name: "Loaded French Fries",
    category: "Sides",
    price: 280,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=85",
    description: "Crispy fries with our signature seasoning.",
  },
];
const anatomy = [
  { name: "Paper straw", note: "Eco-friendly and never soggy", top: 19, side: "right" },
  { name: "Crystal ice", note: "Hand-cubed, slow melting", top: 35, side: "left" },
  { name: "Ceremonial matcha", note: "Whisked smooth, earthy and sweet", top: 46, side: "right" },
  { name: "Chilled milk", note: "Creamy, cold, full-fat", top: 58, side: "left" },
  { name: "Tall glass", note: "Served ice-cold", top: 78, side: "right" },
];
function App() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".nav-inner > *", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      gsap.from(".hero-kicker, .hero-title, .hero-description, .hero-actions", {
        y: 45,
        opacity: 0,
        duration: 1,
        stagger: 0.16,
        delay: 0.2,
        ease: "power3.out",
      });

      gsap.from(".hero-photo", {
        scale: 1.12,
        duration: 1.8,
        ease: "power3.out",
      });

      gsap.to(".hero-photo", {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.from(element, {
          y: 55,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true,
          },
        });
      });

      gsap.to(".delivery-scooter", {
        x: 18,
        y: -7,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });

    return () => ctx.revert();
  }, []);

  const addToCart = (id: number) => {
    setCart((previous) => ({
      ...previous,
      [id]: (previous[id] || 0) + 1,
    }));
  };

  const changeQuantity = (id: number, amount: number) => {
    setCart((previous) => {
      const next = { ...previous };
      const newQuantity = (next[id] || 0) + amount;

      if (newQuantity <= 0) {
        delete next[id];
      } else {
        next[id] = newQuantity;
      }

      return next;
    });
  };

  const cartCount = Object.values(cart).reduce(
    (total, quantity) => total + quantity,
    0,
  );

  const cartTotal = products.reduce(
    (total, product) => total + product.price * (cart[product.id] || 0),
    0,
  );

  const visibleProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  const addCombo = () => {
    addToCart(7);
    addToCart(6);
    addToCart(6);
  };

  return (
  <>
    <Scene3D />
    <header className="site-header"></header>
      <header className="site-header">
        <nav className="nav-inner">
          <a href="#home" className="brand">
            <span className="brand-mark">W.</span>
            <span>
              WASHORA'S
              <small>CAFE & KITCHEN</small>
            </span>
          </a>

          <div className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}>
            <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
            <a href="#menu" onClick={() => setMobileMenuOpen(false)}>Our Menu</a>
            <a href="#bestsellers" onClick={() => setMobileMenuOpen(false)}>Bestsellers</a>
            <a href="#deals" onClick={() => setMobileMenuOpen(false)}>Special Deals</a>
          </div>

          <div className="nav-actions">
            <button
              className="cart-button"
              onClick={() => setCartOpen(true)}
              aria-label="Open shopping cart"
            >
              <ShoppingBag size={19} />
              <span>Cart</span>
              <b>{cartCount}</b>
            </button>
            <button
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-photo" />
          <div className="hero-shade" />

          <div className="hero-content">
            <span className="hero-kicker">
              <span className="kicker-line" />
              YOUR LITTLE MOMENT OF JOY
            </span>

            <h1 className="hero-title" ref={titleRef}>
              Good food.
              <br />
              <em>Better</em> moods.
            </h1>

            <p className="hero-description">
              Freshly brewed coffee, dreamy desserts and comfort food
              made with love. Your favourite corner is waiting.
            </p>

            <div className="hero-actions">
              <a className="button-primary" href="#menu">
                Explore the menu <ArrowRight size={18} />
              </a>
              <span className="hero-note">MADE FRESH. SERVED WITH LOVE.</span>
            </div>
          </div>

          <div className="hero-bottom">
            <span>COFFEE · DESSERTS · COMFORT FOOD</span>
            <a href="#bestsellers">
              SCROLL TO DISCOVER <ArrowDown size={15} />
            </a>
          </div>

          <div className="hero-stamp">
            <span>GOOD DAYS</span>
            <strong>START HERE</strong>
            <span>✳ EST. WITH LOVE ✳</span>
          </div>
        </section>

        <section className="welcome-section section-pad">
          <div className="welcome-image reveal">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=85"
              alt="Warm and welcoming cafe interior"
            />
            <span className="image-label">COME ON IN · STAY A WHILE</span>
          </div>
          <div className="welcome-copy reveal">
            <span className="eyebrow">A LITTLE PLACE, A LOT OF LOVE</span>
            <h2>
              Your table.
              <br />
              <em>Your people.</em>
              <br />
              Your happy place.
            </h2>
            <p>
              From your first morning coffee to that late-night brownie
              craving, we make the little moments taste unforgettable.
            </p>
            <a href="#menu" className="text-link">
              Find your favourite <ArrowRight size={17} />
            </a>
            <span className="welcome-doodle">made with ♥ daily</span>
          </div>
        </section>
<section className="explode-section" id="anatomy">
  <div className="explode-heading">
    <span className="eyebrow">INSIDE OUR #1 BESTSELLER</span>
    <h2>
      Iced Matcha <em>Latte.</em>
    </h2>
    <p>Keep scrolling and watch it come apart.</p>
  </div>

  {anatomy.map((item) => (
    <div
      key={item.name}
      className={`explode-label ${item.side}`}
      style={{ top: `${item.top}vh` }}
    >
      <strong>{item.name}</strong>
      <span>{item.note}</span>
    </div>
  ))}
</section>
        <section className="bestsellers-section section-pad" id="bestsellers">
          <div className="section-heading reveal">
            <div>
              <span className="eyebrow">THE CROWD PLEASERS</span>
              <h2>Can't go wrong <em>with these.</em></h2>
            </div>
            <p>One sip, one bite — and you'll know why.</p>
          </div>

          <div className="bestseller-track">
            {products.slice(0, 3).map((product, index) => (
              <article className="bestseller-card reveal" key={product.id}>
                <div className="product-image-wrap">
                  <img src={product.image} alt={product.name} />
                  <span className="product-tag">{product.tag}</span>
                  <span className="product-number">0{index + 1}</span>
                </div>
                <div className="product-info">
                  <div>
                    <span className="product-category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>
                  <div className="product-buy">
                    <strong>Rs. {product.price}</strong>
                    <button
                      className="add-button"
                      onClick={() => addToCart(product.id)}
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus size={19} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="swipe-hint">YOUR NEXT FAVOURITE IS JUST A BITE AWAY ✳</p>
        </section>

        <section className="menu-section section-pad" id="menu">
          <div className="section-heading menu-heading reveal">
            <div>
              <span className="eyebrow">SOMETHING FOR EVERY CRAVING</span>
              <h2>The good <em>stuff.</em></h2>
            </div>
            <p>Made fresh, served happy. Pick your pleasure.</p>
          </div>

          <div className="category-filters reveal">
            {["All", "Coffee", "Matcha", "Dessert", "Burgers", "Pizza", "Sides"].map(
              (item) => (
                <button
                  key={item}
                  className={category === item ? "filter-active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ),
            )}
          </div>

          <div className="menu-grid">
            {visibleProducts.map((product) => (
              <article className="menu-card reveal" key={product.id}>
                <div className="menu-image-wrap">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  {product.tag && <span className="menu-tag">{product.tag}</span>}
                </div>
                <div className="menu-card-info">
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="menu-card-bottom">
                    <strong>Rs. {product.price}</strong>
                    <button
                      className="menu-add-button"
                      onClick={() => addToCart(product.id)}
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <p className="menu-footnote">
            ✳ All prices are in PKR. Freshly prepared when you order.
          </p>
        </section>

        <section className="deal-section section-pad" id="deals">
          <div className="deal-image reveal">
            <img
              src="https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=1200&q=85"
              alt="Freshly baked pizza for a sharing meal"
              loading="lazy"
            />
            <span className="deal-round-stamp">GOOD FOOD<br />GOOD DEALS</span>
          </div>
          <div className="deal-copy reveal">
            <span className="eyebrow">THE MORE, THE MERRIER</span>
            <h2>
              Big cravings.
              <br />
              <em>Little prices.</em>
            </h2>
            <p className="deal-intro">
              Bring your favourite people. We'll bring the feast.
            </p>
            <div className="deal-offer">
              <span>THE FRIENDS' FEAST</span>
              <h3>1 Pizza <b>+</b> 2 Burgers</h3>
              <div className="deal-price">
                <strong>Rs. 999</strong>
                <span>ONE HAPPY COMBO</span>
              </div>
            </div>
            <button className="button-primary deal-button" onClick={addCombo}>
              Add combo to cart <ArrowRight size={18} />
            </button>
            <p className="deal-cart-note">
              Adds 1 pizza and 2 burgers to your cart.
            </p>
          </div>
        </section>

        <section className="delivery-section">
          <div className="delivery-sun" />
          <div className="delivery-copy reveal">
            <span className="eyebrow">YOUR CRAVINGS, ON THEIR WAY</span>
            <h2>
              Happiness
              <br />
              <em>comes to you.</em>
            </h2>
            <p>
              Staying in? We've got you. Your café favourites,
              packed with love and delivered to your door.
            </p>
            <a href="#menu" className="button-dark">
              Order your favourites <ArrowRight size={18} />
            </a>
          </div>
          <div className="delivery-scene reveal">
            <div className="delivery-cloud cloud-one" />
            <div className="delivery-cloud cloud-two" />
            <div className="city-buildings">
              <span /><span /><span /><span /><span />
            </div>
            <div className="delivery-scooter">
              <Bike size={116} strokeWidth={1.15} />
              <span className="rider-helmet">●</span>
            </div>
            <div className="delivery-road" />
            <div className="free-delivery-banner">
              <span>✳ FRESH FROM OUR CAFE ✳</span>
              <strong>FREE DELIVERY</strong>
              <span>IN YOUR CITY · ORDER NOW</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#home" className="brand footer-brand">
          <span className="brand-mark">W.</span>
          <span>
            WASHORA'S
            <small>CAFE & KITCHEN</small>
          </span>
        </a>
        <p>Good food, good mood. Made with love.</p>
        <a href="#home" className="back-top">BACK TO TOP ↑</a>
        <span className="copyright">© 2026 WASHORA'S CAFE</span>
      </footer>

      {cartOpen && (
        <div className="cart-overlay" onClick={() => setCartOpen(false)}>
          <aside
            className="cart-drawer"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="cart-header">
              <div>
                <span className="eyebrow">SOMETHING DELICIOUS</span>
                <h2>Your bag <em>({cartCount})</em></h2>
              </div>
              <button
                className="close-cart"
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X />
              </button>
            </div>

            {cartCount === 0 ? (
              <div className="empty-cart">
                <ShoppingBag size={42} />
                <h3>Your bag is feeling lonely.</h3>
                <p>Add something delicious to get started.</p>
                <button
                  className="button-primary"
                  onClick={() => setCartOpen(false)}
                >
                  Explore menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {products.filter((product) => cart[product.id]).map((product) => (
                    <div className="cart-item" key={product.id}>
                      <img src={product.image} alt={product.name} />
                      <div className="cart-item-details">
                        <h3>{product.name}</h3>
                        <strong>Rs. {product.price * cart[product.id]}</strong>
                        <div className="quantity-control">
                          <button onClick={() => changeQuantity(product.id, -1)}>-</button>
                          <span>{cart[product.id]}</span>
                          <button onClick={() => changeQuantity(product.id, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-checkout">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <strong>Rs. {cartTotal}</strong>
                  </div>
                  <p>Delivery charges, if any, are calculated at checkout.</p>
                  <button
                    className="button-primary checkout-button"
                    onClick={() =>
                      alert("Your cart is ready! Online checkout will be connected in a future step.")
                    }
                  >
                    Continue to checkout <ArrowRight size={18} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </>
  );
}

export default App;