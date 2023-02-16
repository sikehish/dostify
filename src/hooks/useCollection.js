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
  const [isPending, setIsPending] = useState(true);

  const qry = useRef(q).current;
  // const orderBy = useRef(orderBy).current

  useEffect(() => {
    // setIsPending(true);
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

    setIsPending(false);

    // unsubscribe on unmount
    return () => {
      // setIsPending(false);
      unsubscribe();
    };
  }, [col, qry]);

  return { documents, error, isPending };
};
