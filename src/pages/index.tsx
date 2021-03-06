import { GetStaticProps } from 'next'

import Head from 'next/head'
import styles from './home.module.scss'
import { stripe } from '../services/stripe'

import { SubscribeButton } from '../components/SubscribeButton'

interface HomeProps {
  product: {
    priceId: string,
    amount: string
  }
}

export default function Home({product}: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
        <meta property='og:title' content='ig.news' />
        <meta
        property='og:description'
        content='Notícias sobre ReactJS'
        />
        <meta property='og:url' content='https://ignews-coral-gamma.vercel.app/' />
        <meta property='og:type' content='website' />
        <meta property="og:image" content="images/ignews.png"/>
      </Head> 

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span> 👏 Hey, welcome </span>
          <h1>
            News about the <span>React</span>
          </h1>
            <p>
              Get access to all the publications <br/>
              <span>for {product.amount} month</span>
            </p>
          <SubscribeButton/>
        </section>

        <img src="/images/avatar.svg" alt="Girl Codding" />
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KFMSaGfDwxb0oPwwuplVwJK')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product
    },
    revalidate: 60 * 60 * 24, // 24 hours
  }
}