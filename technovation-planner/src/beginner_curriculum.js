import { db, collection, query, orderBy, getDocs } from './configuration';

const collectionRef = collection(db, 'beginner_curriculum');
const q = query(collectionRef, orderBy('unit', 'asc'), orderBy('order', 'asc'));

export const lessons = getDocs(q)
    .then((snap) => 
        snap.docs.map((doc) => {
            const data = doc.data();
            return {
                title: data.title,
                length: data.length,
                length_int: data.length_int,
                hours: data.hours,
                minutes: data.minutes,
                unit: data.unit,
                order: data.order,
            };
        })
    )
    .catch ((error) => {
        console.error("Error fetching curriculum: ", error);
        return [];
    });