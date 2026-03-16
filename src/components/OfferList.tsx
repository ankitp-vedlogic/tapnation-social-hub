import React from "react";
import { View } from "react-native";
import OfferCard from "./OfferCard";
import { useOfferStore } from "@/stores/offerStore";

export default function OfferList() {

    const { offers } = useOfferStore();

    return (
        <View>
            {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
            ))}
        </View>
    );
}
