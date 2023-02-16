import { useEffect, useRef, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

export const useCollection = (col, q) => {
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);

  const qry = useRef(q).current;
  // const orderBy = useRef(orderBy).current

  useEffect(() => {
    let ref = collection(db, col);
    console.log(col, qry, q);

    if (qry) {
      ref = query(ref, where(...qry) /*, orderBy("createdAt", "desc")*/);
    }

    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        let results = [];
        snapshot.docs.forEach((doc) => {
          console.log(doc);
          results.push({ ...doc.data(), id: doc.id });
        });

        // update state
        setDocuments(results);
        setError(null);
      },
      (error) => {
        console.log(error);
        setError("could not fetch the data");
      }
    );

    // unsubscribe on unmount
    return () => unsubscribe();
  }, [col, qry]);

  return { documents, error };
};
