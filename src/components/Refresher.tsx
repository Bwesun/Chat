import { IonRefresher, IonRefresherContent } from "@ionic/react";
import React from "react";

const Refresher: React.FC = () => {
    const handleRefresh = (event: CustomEvent) => {
        console.log('Refreshing...');
        
        // Do your fetch, update, etc.
        setTimeout(() => {
          // When your refresh logic is done:
          event.detail.complete();
        }, 2000); // simulate a 2 second refresh
      };

    return ( 
            <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                {/* REFRESH PAGE ON PULL FROM TOP */}
                <IonRefresherContent color=""
                    className="custom-refresher"
                    pullingText="Pull to refresh"
                    refreshingSpinner="crescent"
                    refreshingText="Refreshing..."
                />
            </IonRefresher>
     );
}
 
export default Refresher;