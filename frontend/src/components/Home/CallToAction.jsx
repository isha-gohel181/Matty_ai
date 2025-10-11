import { Button } from "@/components/ui/button";



const CallToAction = () => {

 return (

    <section className="py-20 sm:py-32">

      <div className="mx-auto max-w-screen-xl px-4 text-center">

        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-teal-500 p-12">

          <h2 className="text-4xl font-bold">Ready to Bring Your Ideas to Life?</h2>

          <Button size="lg" variant="outline" className="mt-8 rounded-full bg-transparent px-8 py-6 text-lg hover:bg-white hover:text-black">

            Create Your Free Account Now

          </Button>

        </div>

      </div>

    </section>

  );

};



export default CallToAction;