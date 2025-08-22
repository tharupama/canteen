import { collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';

const foodItems = [
  {
    id: "chicken-rice",
    name: "Chicken Rice",
    description: "Delicious chicken curry with steamed rice",
    price: 320,
    category: "Rice Dishes",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400"
  },
  {
    id: "fish-rice",
    name: "Fish Rice",
    description: "Fresh fish curry with steamed rice",
    price: 300,
    category: "Rice Dishes",
    available: false, // Set as unavailable for demo
    imageUrl: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=400"
  },
  {
    id: "vegetable-rice",
    name: "Vegetable Rice",
    description: "Mixed vegetables with steamed rice",
    price: 250,
    category: "Rice Dishes",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=400"
  },
  {
    id: "chicken-fried-rice",
    name: "Chicken Fried Rice",
    description: "Stir-fried rice with chicken and vegetables",
    price: 450,
    category: "Rice Dishes",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400"
  },
  {
    id: "coca-cola",
    name: "Coca Cola",
    description: "Refreshing soft drink",
    price: 100,
    category: "Beverages",
    available: false, // Set as unavailable for demo
    imageUrl: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400"
  },
  {
    id: "egg-rice",
    name: "Egg Rice",
    description: "Fried egg with steamed rice",
    price: 200,
    category: "Rice Dishes",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400"
  },
  {
    id: "sprite",
    name: "Sprite",
    description: "Lemon-lime flavored soft drink",
    price: 100,
    category: "Beverages",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400"
  },
  {
    id: "mixed-fried-rice",
    name: "Mixed Fried Rice",
    description: "Fried rice with mixed seafood and vegetables",
    price: 500,
    category: "Rice Dishes",
    available: false, // Set as unavailable for demo
    imageUrl: "https://images.unsplash.com/photo-1594030580827-7cdc07c6e228?w=400"
  }
];

export const seedDatabase = async (clearExisting = false) => {
  try {
    console.log('Starting database seed...');
    
    // Optionally clear existing food items
    if (clearExisting) {
      console.log('Clearing existing food items...');
      const querySnapshot = await getDocs(collection(db, 'foodItems'));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log('Existing items cleared');
    }
    
    // Add or update food items using setDoc with predefined IDs
    for (const item of foodItems) {
      const { id, ...itemData } = item;
      await setDoc(doc(db, 'foodItems', id), itemData);
      console.log(`Updated/Added: ${item.name}`);
    }
    
    console.log('Food items updated successfully!');
    
    // Create a staff account
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        'staff@canteen.com',
        'staff123'
      );
      console.log('Staff account created:', userCredential.user.email);
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('Staff account already exists');
      } else {
        console.error('Error creating staff account:', error);
      }
    }
    
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Run this function once to seed your database
// seedDatabase(); // Updates existing items or adds new ones
// seedDatabase(true); // Clears all existing items first, then adds fresh data