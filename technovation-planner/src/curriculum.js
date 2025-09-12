import { db, collection, query, orderBy, getDocs } from './configuration';

export async function lessons(division) {
    const collectionRef = collection(db, `${division}_curriculum`);
    const q = query(collectionRef, orderBy('unit', 'asc'), orderBy('order', 'asc'));

    try {
        const snap = await getDocs(q);
        console.log("Snapshot: ", snap);
        console.log("Docs: ", snap.docs);
        return snap.docs.map((doc) => {
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
        });
    } catch (error) {
        console.error("Error fetching curriculum: ", error);
        return [];
    };
}