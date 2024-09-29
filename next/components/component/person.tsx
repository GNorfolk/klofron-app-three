import { BriefcaseIcon, MapPinIcon, TreesIcon, HardHatIcon, GrapeIcon, UserIcon } from '../ui/icon'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { GrayButton } from "../ui/button"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form"
import { HeaderOne, HeaderTwo, HeaderThree } from '../ui/header'
import { DivIconInfo } from '../ui/div'
import { StyledSelect } from '../ui/input'

export function PersonListing({ personData, familyName = null, queryClient = null, userId = null }) {
  type Inputs = {
    action_type_id: number,
    action_queue_id: number
  }

  const onAction: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 0)
  }

  const onQueue: SubmitHandler<Inputs> = (formData) => {
    onSubmit(formData, 1)
  }

  const onSubmit = (formData: Inputs, addToQueue: number) => {
    axios.post(process.env.NEXT_PUBLIC_API_HOST + '/v2/action', {
      action_queue_id: formData.action_queue_id,
      action_type_id: formData.action_type_id,
      action_add_to_queue: addToQueue
    }).then(response => {
      queryClient.invalidateQueries()
      document.getElementById("cm-" + formData.action_queue_id).innerText = ' '
    }).catch(error => {
      document.getElementById("cm-" + formData.action_queue_id).innerText = error.response.data.message
    })
  }

  return (
    <main>
      <HeaderOne>People</HeaderOne>
      { personData.length > 0 ? personData.map(({ person_id, person_name, person_family, person_action_queue, person_action_queue_id, person_house, person_skills, person_teacher_id }) => {
        const methods = useForm<Inputs>();
        return (
          <>
            <a href={`/person/${person_id}`} className="p-6 pt-2 pb-2">
              <HeaderThree>{familyName ? person_name + " " + familyName : person_name + " " + person_family.family_name}</HeaderThree>
              {
                queryClient ? <>
                  <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
                    <DivIconInfo>
                      <GrapeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_gatherer_level} Gatherer level</span>
                    </DivIconInfo>
                    <DivIconInfo>
                      <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_lumberjack_level} Lumberjack level</span>
                    </DivIconInfo>
                    <DivIconInfo>
                      <HardHatIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_skills.person_skills_builder_level} Builder level</span>
                    </DivIconInfo>
                  </div>
                </> : <>
                  <div className="grid grid-cols-2">
                    <DivIconInfo>
                      <BriefcaseIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_action_queue.action_queue_current_action ? "One" : "No"} Current Action</span>
                    </DivIconInfo>
                    <DivIconInfo>
                      <MapPinIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                      <span className='whitespace-nowrap'>{person_house?.house_address.house_address_number} {person_house?.house_address.house_address_road.house_road_name}</span>
                    </DivIconInfo>
                  </div>
                </>
              }
            </a>
            {
              queryClient && userId === person_family?.family_user_id ? <>
                <div>
                  <FormProvider {...methods}>
                    <form className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <input type="hidden" value={person_action_queue_id} {...methods.register("action_queue_id")} />
                        <StyledSelect fieldName="action_type_id" fieldRequired={true}>
                          {
                            person_teacher_id ? <>
                              <option selected disabled value="-1">Unavailable</option>
                            </> : <>
                              <option value="1">Get Food</option>
                              <option value="2">Get Wood</option>
                              <option value="3">Increase Storage</option>
                              <option value="4">Increase Rooms</option>
                              <option value="5">Create House</option>
                            </>
                          }
                        </StyledSelect>
                        <GrayButton onClick={methods.handleSubmit(onAction)} text="Start Action" />
                        <GrayButton onClick={methods.handleSubmit(onQueue)} text={"(" + person_action_queue.action_queue_next_actions.length + ") Add to Queue"} />
                      </div>
                    </form>
                  </FormProvider>
                  {
                    queryClient && person_action_queue.action_queue_current_action?.action_time_remaining ? <>
                      <small className="text-gray-500 ml-2">{person_name} is performing {person_action_queue.action_queue_current_action.action_type_name} completing in {person_action_queue.action_queue_current_action.action_time_remaining}. </small>
                    </> : <></>
                  }
                  <small className="text-gray-500" id={'cm-' + person_action_queue_id}></small>
                </div>
              </> : null
            }
          </>
        )
      }) :
        <a className="p-6 pt-2 pb-2">
          <HeaderThree>There are no people to show!</HeaderThree>
        </a>
      }
    </main>
  )
}

export function PersonInfo({ title, personInfo }) {
  return (
    <main>
      <HeaderTwo>{title + " Info"}</HeaderTwo>
        <a href={"/person/" + personInfo.person_id + "/betrothal"} className="p-6 pt-2 pb-2">
          <div className="grid grid-cols-1">
            <div className="grid grid-cols-1">
              <DivIconInfo>
                <UserIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span>{personInfo.person_name} {personInfo.person_family.family_name} is a {personInfo.person_age} year old {personInfo.person_gender}.</span>
              </DivIconInfo>
            </div>
            <div className="grid sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DivIconInfo>
                <GrapeIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_gatherer_level} Gatherer level</span>
              </DivIconInfo>
              <DivIconInfo>
                <TreesIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_lumberjack_level} Lumberjack level</span>
              </DivIconInfo>
              <DivIconInfo>
                <HardHatIcon className="w-5 h-5 min-w-5 min-h-5 mr-2" />
                <span className='whitespace-nowrap'>{personInfo.person_skills.person_skills_builder_level} Builder level</span>
              </DivIconInfo>
            </div>
          </div>
        </a>
    </main>
  )
}