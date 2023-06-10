import { useEffect, useState } from "react";
function Me() {
    const [isUsedSuscribed, setIsUsedSuscribed] = useState(false);
    const [subscriptionPrice, setSubscriptionPrice] = useState(0);
    const [subscriptionExpireDate, setSubscriptionExpireDate] = useState(0);
    const [loading, setLoading] = useState(true);
    console.log(subscriptionExpireDate, isUsedSuscribed, subscriptionPrice)
    
    async function setSubscriptionPriceState() {
        const data = await fetch(`/api/getSubscriptionPrice`, { method: 'GET' })
        const data_json = await data.json();
        if(data_json.error===null){
            setSubscriptionPrice(data_json.data?.suscription_amount);
        }
    }

    async function setSubscriptionDetails() {
        const temporal_hardcodeaddress = '0x00000000000000000000000000000000003d3403';
        const data = await fetch(`/api/userSuscribed?address=${temporal_hardcodeaddress}`, { method: 'GET' })
        const data_json = await data.json();
        if (data_json.error === null) {
            setSubscriptionExpireDate(data_json.data?.renew_suscription_date);
            setIsUsedSuscribed(data_json.data?.isUsersuscribed);
        }

    }

    useEffect(() => {
        setSubscriptionPriceState();
        setSubscriptionDetails();
    }, []);

    return <div>me</div>
}

export default Me