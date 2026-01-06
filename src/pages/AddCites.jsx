import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TfiBackRight } from "react-icons/tfi";
import Loading from '@/components/feedback/Loading';
import FormAddJourney from '@/components/forms/FormAddJourney';
import FormAddCityes from '@/components/forms/FormAddCityes';
const AddCites = () => {
    const navigate = useNavigate()

    return (
        <div className='container'>
            <div className="flex items-center gap-4">
                {/* {isEditSession ? (
                          <h2 className=" text-xl md:text-2xl lg:text-4xl font-bold  text-white  my-8 ">
                              تعديل بيانات الاعلان
                          </h2>
                      ) : (
                          <h2 className=" text-xl md:text-2xl lg:text-4xl font-bold  text-white  my-8 ">
                              إضافة اعلان جديد
                          </h2>
                      )} */}

                <h2 className=" text-xl md:text-2xl lg:text-4xl font-bold  text-primary-1  my-8 "> اضافة مدينه جديده</h2>

                <button onClick={() => navigate(-1)}>
                    <TfiBackRight size={24} className="text-primary-1" />
                </button>
            </div>

            <div className='mb-8'>
                {/* <Loading >
                    <FormAddAdvertise ads={singleAds} isEditSession={isEditSession} />
                </Loading> */}
                <FormAddCityes />
            </div>
        </div>
    )
}

export default AddCites
