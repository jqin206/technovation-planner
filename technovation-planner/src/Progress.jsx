import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "./configuration";
import './Progress.css';
import beginner_curriculum from './beginner.json';
import junior_curriculum from './junior.json';
import senior_curriculum from './senior.json';

export default function Progress() {
  const [division, setDivision] = useState('');
  const [curriculum, setCurriculum] = useState(null); // Initialize to null to handle async state
  const [unitPageIndex, setUnitPageIndex] = useState({});
  const [moduleCompletion, setModuleCompletion] = useState({});
  

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "users"), where("email", "==", user.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs[0].data();
        setDivision(data.division);
      }
    };

    fetchData();
  }, []);

  // Fetch curriculum based on division
  useEffect(() => {
    if (!division) return; // Wait for division to be set before fetching curriculum

    switch (division) {
      case 'beginner':
        setCurriculum(beginner_curriculum);
        break;
      case 'junior':
        setCurriculum(junior_curriculum);
        break;
      case 'senior':
        setCurriculum(senior_curriculum);
        break;
      default:
        setCurriculum(null);
        break;
    }
  }, [division]);

  // If curriculum is not loaded, display loading message
  if (!curriculum || !curriculum.data || !curriculum.columns) {
    return <p>Loading curriculum...</p>;
  }

  // Destructure columns and data
  const { columns, data } = curriculum;

  // Map data to an array of modules
  const modules = data.map((row) =>
    columns.reduce((acc, key, i) => {
      acc[key] = row[i];
      return acc;
    }, {})
  );

  // Group modules by unit
  const grouped = modules.reduce((acc, mod) => {
    const key = `Unit ${mod.unit}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(mod);
    return acc;
  }, {});

  const handleCheckboxChange = (unit, idx) => {
    setModuleCompletion(prev => ({
      ...prev,
      [`${unit}-${idx}`]: !prev[`${unit}-${idx}`],
    }));
  };

  const calculateProgress = (unit, mods) => {
    const total = mods.length_int;
    const completed = mods.filter((_, idx) => moduleCompletion[`${unit}-${idx}`]).length_int;
    return (completed / total) * 100;
  };

    // Navigate to the next page for a unit
    const goToNextPage = (unit) => {
        setUnitPageIndex((prev) => {
         const currentPage = prev[unit] || 0; // Get the current page, default to 0 if undefined
        return {
            ...prev,
            [unit]: currentPage + 1, // Increment the page index
        };
        });
    };
  
  // Navigate to the previous page for a unit
  const goToPrevPage = (unit) => {
    setUnitPageIndex((prev) => {
      const currentPage = prev[unit] || 0; // Get the current page, default to 0 if undefined
      return {
        ...prev,
        [unit]: Math.max(currentPage - 1, 0), // Decrement the page index, ensuring it doesn't go below 0
      };
    });
  };


  return (
    <div className="progress">
      <h1 className="countdown">My Progress</h1>

      {Object.entries(grouped).map(([unit, mods]) => {
        // Calculate the number of pages needed
        const currentPage = unitPageIndex[unit] || 0;
        const itemsPerPage = 4;
        const totalPages = Math.ceil(mods.length / itemsPerPage);
        const startIdx = currentPage * itemsPerPage;
        const visibleMods = mods.slice(startIdx, startIdx + itemsPerPage);
        const unitNumber = unit.split(" ")[1];  // Extract the number part of "Unit X"
        // Create the dynamic class name based on the unit number
        const unitClassName = `unit${unitNumber}`;

        return (
          <div key={unit}>
            <div className="unit-header">
              <p className="units">{unit}</p>
              <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${calculateProgress(unit, mods)}%` }}
                />
                </div>
            </div>
            <div className={`units-container ${unitClassName}`}>
                <div className="unit-modules">
                {visibleMods.map((mod, idx) => (
                    <div key={idx} className="modules">
                        <input type="checkbox" id={`checkbox-${unit}-${idx}`} />
                        <strong className='module-title'>{mod.title}</strong>
                    </div>
                ))}
                </div>
                {totalPages > 1 && (
          <div className="pagination-buttons">
            {currentPage > 0 && (
              <button
                className="pagination-button prev"
                onClick={() => goToPrevPage(unit)}
                disabled={currentPage <= 0}
              >
                ◀
              </button>
            )}

            {currentPage < totalPages - 1 && (
              <button
                className="pagination-button next"
                onClick={() => goToNextPage(unit)}
                disabled={currentPage >= totalPages - 1}
              >
                ▶
              </button>
            )}
          </div>
        )}
            </div>
          </div>
        );
      })}
    </div>
  );
}