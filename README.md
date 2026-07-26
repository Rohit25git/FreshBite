# FreshBite

## HTML File Structure (`index.html`)

The main HTML file (`index.html`) serves as the backbone of the FreshBite food delivery application. It contains a single-page application (SPA) structure with multiple page views that are toggled via JavaScript.

### Key Components:

#### 1. **Header Navigation**
- Brand logo with emoji branding (🍊 FreshBite)
- Responsive mobile toggle menu
- Action buttons: Wishlist, Account, and Cart
- Badge counters for wishlist and cart items

#### 2. **Home Page** (`#page-home`)
- **Hero Section** — Compelling headline and call-to-action buttons
- **Hero Stats** — Displays key metrics (120+ partner kitchens, 4.8★ rating, 25 min avg delivery)
- **Category Scroll** — "Shop by category" section (dynamically populated)
- **Featured Dishes** — Chef's picks grid (4-column layout)
- **Promotional Banner** — Displays welcome code (WELCOME15)
- **Popular Restaurants** — 3-column grid of trending restaurants

#### 3. **Restaurant Listing** (`#page-restaurants`)
- Filterable restaurant grid with:
  - Cuisine filter
  - Price range filter ($ to $$$)
  - Sort options (Recommended, Highest Rated, Fastest Delivery)
  - Minimum rating filter
- Dynamic result count display

#### 4. **Menu Page** (`#page-menu`)
- Restaurant hero/banner section
- Dietary preference filters (All, Veg, Non-Veg, Vegan, Gluten-Free)
- Category-based dish organization

#### 5. **Product Detail** (`#page-product`)
- Individual dish view with full details
- Add-to-cart functionality
- Back-to-menu navigation

#### 6. **Cart & Checkout** (`#page-cart`, `#page-checkout`)
- Cart page content (dynamically rendered)
- Checkout form with delivery and payment details
- Total calculations and order summary

#### 7. **Account** (`#page-account`)
- **Authentication Gate** — Login/Register prompts for non-authenticated users
- **Tabbed Interface**:
  - Profile — User account information
  - Order History — Past orders and delivery status
  - Saved Addresses — Delivery address management
  - Wishlist — Favorited dishes

#### 8. **Authentication** (`#page-login`)
- Dual-tab interface for Login and Register
- Login form (Email, Password)
- Registration form (Full Name, Email, Password)
- Demo-only disclaimer (no real data sent)

#### 9. **About** (`#page-about`)
- Company story and mission statement
- Award showcase (2023-2025)
- Team member cards with roles

#### 10. **Contact** (`#page-contact`)
- Map placeholder and contact information
- Business hours, phone, email, address
- Contact form for inquiries

#### 11. **Cart Drawer** (Sidebar)
- Slide-out cart overlay (`.cart-drawer`)
- Quick order review and checkout access
- Close button and backdrop overlay

#### 12. **Footer**
- Brand information and social links
- Navigation footer links
- Copyright and project attribution

### Technical Details:

- **Single-Page Architecture** — Multiple `page-view` divs toggled via `active` class and `aria-hidden` attributes
- **Navigation System** — `data-nav` attributes on buttons for smooth page transitions
- **Responsive Design** — Mobile-first approach with nav toggle (`#navToggle`)
- **Accessibility** — Semantic HTML, ARIA labels, and keyboard-friendly elements
- **Dynamic Content** — Placeholder containers (grids, forms) populated by `app.js`
- **External Dependencies**:
  - `style.css` — All styling
  - `data.js` — Mock data and restaurant/dish database
  - `app.js` — Application logic and event handlers
- **Toast Notifications** — `#toast` container for user feedback (errors, confirmations)

### File Structure Map:

```
FreshBite/
├── index.html (this file)
├── style.css (styling)
├── app.js (JavaScript logic)
├── data.js (mock data)
└── README.md (documentation)
```

This modular structure allows for easy navigation and content management while keeping the DOM clean and organized.
